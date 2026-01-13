import express from 'express';
import Attendance from '../models/Attendance.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/attendance
// @desc    Create/update attendance (supports bulk)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { records } = req.body; // Array of { staffId, date, status, notes? }

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'Records array is required' });
    }

    const results = [];
    const errors = [];

    for (const record of records) {
      const { staffId, date, status, notes } = record;

      if (!staffId || !date || !status) {
        errors.push({ record, error: 'Missing required fields: staffId, date, status' });
        continue;
      }

      if (!['present', 'absent'].includes(status)) {
        errors.push({ record, error: 'Status must be "present" or "absent"' });
        continue;
      }

      try {
        // Normalize date to start of day for consistent storage
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOneAndUpdate(
          { staffId, date: attendanceDate },
          { status, notes: notes || '' },
          { new: true, upsert: true, runValidators: true }
        );

        results.push(attendance);
      } catch (error) {
        errors.push({ record, error: error.message });
      }
    }

    if (errors.length > 0 && results.length === 0) {
      return res.status(400).json({ message: 'All records failed', errors });
    }

    res.status(201).json({
      success: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/attendance
// @desc    Get attendance records with filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { date, staffId, startDate, endDate, status } = req.query;
    const query = {};

    if (date) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(attendanceDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: attendanceDate, $lt: nextDay };
    }

    if (staffId) query.staffId = staffId;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.date = query.date || {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const attendance = await Attendance.find(query)
      .populate('staffId', 'name role branch')
      .sort({ date: -1, createdAt: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/attendance/staff/:staffId
// @desc    Get attendance for specific staff
// @access  Private
router.get('/staff/:staffId', protect, async (req, res) => {
  try {
    const { staffId } = req.params;
    const { startDate, endDate, status } = req.query;
    const query = { staffId };

    if (status) query.status = status;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(100);

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/attendance/date/:date
// @desc    Get attendance for specific date
// @access  Private
router.get('/date/:date', protect, async (req, res) => {
  try {
    const { date } = req.params;
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const attendance = await Attendance.find({
      date: { $gte: attendanceDate, $lt: nextDay }
    })
      .populate('staffId', 'name role branch')
      .sort({ createdAt: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/attendance/:id
// @desc    Delete attendance record
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
