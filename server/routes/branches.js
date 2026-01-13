import express from 'express';
import Branch from '../models/Branch.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/branches
// @desc    Get all branches
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = {};

    if (isActive !== undefined) query.isActive = isActive === 'true';

    const branches = await Branch.find(query).sort({ name: 1 });
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/branches
// @desc    Create branch
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/branches/:id
// @desc    Update branch
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.json(branch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

