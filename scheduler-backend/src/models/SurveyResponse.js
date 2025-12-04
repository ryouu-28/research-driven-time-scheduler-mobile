const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to User model
    ref: 'User',                           // Links to User collection
    required: true
  },
  answers: [{                              // Array of answers
    questionId: String,                    // e.g., "Q1", "Q15"
    selectedOption: String,                // e.g., "A", "B", "Yes"
    score: Object                          // e.g., { mood: 2, overwhelm: 1 }
  }],
  scores: {                                // Running total of scores
    mood: { type: Number, default: 0 },
    overwhelm: { type: Number, default: 0 },
    reward: { type: Number, default: 0 },
    perfection: { type: Number, default: 0 },
    classic: { type: Number, default: 0 },
    drifter: { type: Number, default: 0 }
  },
  determinedType: {                        // Final result
    type: String,
    enum: ['mood', 'overwhelm', 'reward', 'perfection', 'classic', 'drifter']
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);