import express from 'express';
import multer from 'multer';
import path from 'path';
import Staff from '../models/Staff.js';
import Attendance from '../models/Attendance.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @route   GET /api/staff
// @desc    Get all staff (public, with branch filter and attendance filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { branch, category, isActive, excludeAbsentOnDate } = req.query;
    const query = {};

    if (branch) query.branch = branch;
    if (category) {
      // If category is provided, check if it's in the category array
      query.category = { $in: Array.isArray(category) ? category : [category] };
    }
    if (isActive !== undefined) query.isActive = isActive === 'true';

    let staff = await Staff.find(query).sort({ branch: 1, name: 1 });

    // Filter by attendance if excludeAbsentOnDate is provided
    if (excludeAbsentOnDate) {
      const attendanceDate = new Date(excludeAbsentOnDate);
      attendanceDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(attendanceDate);
      nextDay.setDate(nextDay.getDate() + 1);

      // Get all attendance records for the date
      const attendanceRecords = await Attendance.find({
        date: { $gte: attendanceDate, $lt: nextDay }
      }).select('staffId status');

      // Create set of absent staff IDs (staff with explicit "absent" status)
      const absentStaffIds = new Set(
        attendanceRecords
          .filter(record => record.status === 'absent')
          .map(record => record.staffId.toString())
      );

      // Filter staff to exclude only those explicitly marked as absent
      // Staff without attendance records are considered present (default behavior)
      staff = staff.filter(member => !absentStaffIds.has(member._id.toString()));
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/staff
// @desc    Create staff member
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const staffData = { ...req.body };
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      staffData.image = `${baseUrl}/uploads/${req.file.filename}`;
    }
    const staff = await Staff.create(staffData);
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/staff/:id
// @desc    Update staff
// @access  Private
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const staffData = { ...req.body };
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      staffData.image = `${baseUrl}/uploads/${req.file.filename}`;
    }
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      staffData,
      { new: true, runValidators: true }
    );
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PATCH /api/staff/:id/branch
// @desc    Change staff branch
// @access  Private
router.patch('/:id/branch', protect, async (req, res) => {
  try {
    const { branch } = req.body;
    if (!branch) {
      return res.status(400).json({ message: 'Branch is required' });
    }

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { branch },
      { new: true }
    );
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/staff/:id
// @desc    Soft delete staff
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

