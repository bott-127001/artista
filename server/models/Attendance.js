import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true,
    default: 'present'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate attendance records
attendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });
// Index for date-based queries
attendanceSchema.index({ date: 1 });
// Index for staff-based queries
attendanceSchema.index({ staffId: 1 });

export default mongoose.model('Attendance', attendanceSchema);
