import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/coupons
// @desc    Get all coupons (public - for validation)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (code) {
      // Validate a specific coupon code
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      
      const isValid = coupon.isValid();
      if (!isValid) {
        return res.status(400).json({ 
          message: 'Coupon is not valid',
          valid: false 
        });
      }
      
      return res.json({
        ...coupon.toObject(),
        valid: true
      });
    }
    
    // Get all active coupons (for public display)
    const coupons = await Coupon.find({ isActive: true })
      .where('validFrom').lte(new Date())
      .where('validTo').gte(new Date())
      .sort({ createdAt: -1 });
    
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/coupons/validate
// @desc    Validate coupon and calculate discount
// @access  Public
router.post('/validate', async (req, res) => {
  try {
    const { code, price } = req.body;
    
    if (!code || !price) {
      return res.status(400).json({ message: 'Code and price are required' });
    }
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    if (!coupon.isValid()) {
      return res.status(400).json({ 
        message: 'Coupon is not valid',
        valid: false 
      });
    }
    
    const discount = coupon.calculateDiscount(price);
    const finalPrice = price - discount;
    
    res.json({
      valid: true,
      coupon: coupon.toObject(),
      discount,
      finalPrice,
      originalPrice: price
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/coupons/all
// @desc    Get all coupons (admin)
// @access  Private
router.get('/all', protect, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/coupons/:id
// @desc    Get coupon by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/coupons
// @desc    Create coupon
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const couponData = {
      ...req.body,
      code: req.body.code.toUpperCase()
    };
    const coupon = await Coupon.create(couponData);
    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/coupons/:id
// @desc    Update coupon
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }
    
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.json(coupon);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete coupon
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
