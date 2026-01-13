import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  announcementText: {
    type: String,
    trim: true,
    default: ''
  },
  isAnnouncementActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model('Settings', settingsSchema);
