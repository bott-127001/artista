import express from 'express';
import Booking from '../models/Booking.js';
import Branch from '../models/Branch.js';
import Service from '../models/Service.js';
import { protect } from '../middleware/auth.js';
import { generateWhatsAppLink, formatBookingConfirmationMessage } from '../utils/whatsapp.js';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { service, subService, ...bookingData } = req.body;

    // Validate that service field is provided
    if (!service) {
      return res.status(400).json({ message: 'Service is required' });
    }

    // Determine the actual service name to store
    // If subService is provided, use it; otherwise find a service in the category
    let serviceName = subService || service;
    let bookingAmount = 0;

    if (service) {
      let serviceDoc = null;
      
      if (subService) {
        // If subService is provided, find the specific service
        serviceDoc = await Service.findOne({
          category: service,
          name: subService,
          isActive: true
        });
      } else {
        // If no subService, find the first service in the category
        serviceDoc = await Service.findOne({
        category: service,
        isActive: true
      });
      }

      if (serviceDoc) {
        // Use the actual service name
        serviceName = serviceDoc.name;
        if (serviceDoc.priceType === 'fixed' && serviceDoc.priceAmount) {
        // Convert to paise (multiply by 100) for consistency, but can be stored as rupees
        bookingAmount = serviceDoc.priceAmount * 100;
        }
      }
    }

    // Create booking with service information
    const booking = await Booking.create({
      ...bookingData,
      service: serviceName, // Store the actual service name
      serviceCategory: service, // Store the category (e.g., "Haircare")
      subService: subService || '',
      amount: bookingAmount,
      date: new Date(bookingData.date)
    });

    // Emit socket event for new booking
    const io = req.app.locals.io;
    if (io) {
      io.emit('new-booking', booking);
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, branch, startDate, endDate, service } = req.query;
    const query = {};

    if (status) query.status = status;
    if (branch) query.branch = branch;
    if (service) query.service = service;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(1000);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/analytics
// @desc    Get booking analytics
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateQuery = {};

    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) dateQuery.date.$gte = new Date(startDate);
      if (endDate) dateQuery.date.$lte = new Date(endDate);
    }

    // Bookings by service
    const bookingsByService = await Booking.aggregate([
      { $match: dateQuery },
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Bookings by branch
    const bookingsByBranch = await Booking.aggregate([
      { $match: dateQuery },
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $match: dateQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Bookings over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const bookingsOverTime = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          ...dateQuery
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Total counts
    const totalBookings = await Booking.countDocuments(dateQuery);
    const pendingBookings = await Booking.countDocuments({ ...dateQuery, status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ ...dateQuery, status: 'confirmed' });

    res.json({
      byService: bookingsByService,
      byBranch: bookingsByBranch,
      byStatus: bookingsByStatus,
      overTime: bookingsOverTime,
      totals: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/bookings/:id
// @desc    Update booking
// @access  Private
router.patch('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/:id/whatsapp
// @desc    Get WhatsApp confirmation/cancellation link
// @access  Private
router.get('/:id/whatsapp', protect, async (req, res) => {
  try {
    const { isCancellation } = req.query;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const branch = await Branch.findOne({ name: booking.branch });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const message = formatBookingConfirmationMessage(booking, branch.whatsappNumber, isCancellation === 'true');
    const whatsappLink = generateWhatsAppLink(branch.whatsappNumber, message);

    res.json({ whatsappLink, message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

