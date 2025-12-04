const mongoose = require('mongoose');

const traitProfileSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mood', 'overwhelm', 'reward', 'perfection', 'classic', 'drifter'],
    required: true,
    unique: true          // Only one profile per type
  },
  title: String,          // e.g., "The Mood-Dependent Procrastinator"
  description: String,    // Full description
  characteristics: [String],  // Array of traits
  focusDuration: Number,  // Recommended focus time in minutes
  breakDuration: Number,  // Recommended break time in minutes
  sessionsPerDay: Number, // How many sessions per day
  bestTimeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'flexible']
  },
  needsFrequentReminders: Boolean,
  needsDeadlinePressure: Boolean,
  recommendations: [String]  // Array of tips
});

module.exports = mongoose.model('TraitProfile', traitProfileSchema);