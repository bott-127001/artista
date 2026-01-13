import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  programId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    trim: true,
    default: ''
  },
  duration: {
    type: String,
    trim: true,
    default: ''
  },
  focus: {
    type: String,
    trim: true,
    default: ''
  },
  certification: {
    type: String,
    trim: true,
    default: ''
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
  }
}, {
  timestamps: true
});

// Index for faster queries
courseSchema.index({ programId: 1 });
courseSchema.index({ isActive: 1 });

export default mongoose.model('Course', courseSchema);
