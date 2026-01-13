import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: String,
    trim: true,
    default: 'Varies'
  },
  priceType: {
    type: String,
    enum: ['fixed', 'varies', 'consultation'],
    default: 'varies'
  },
  priceAmount: {
    type: Number,
    min: 0,
    default: null
  },
  originalPrice: {
    type: Number,
    min: 0,
    default: null
  },
  discountedPrice: {
    type: Number,
    min: 0,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  branch: {
    type: String,
    trim: true,
    default: 'All Branches'
  }
}, {
  timestamps: true
});

// Validation: priceAmount must be provided when priceType is 'fixed'
serviceSchema.pre('validate', function(next) {
  if (this.priceType === 'fixed' && (!this.priceAmount || this.priceAmount <= 0)) {
    return next(new Error('Price amount is required when price type is fixed'));
  }
  next();
});

// Index for faster queries
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ name: 1 });

export default mongoose.model('Service', serviceSchema);

