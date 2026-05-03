const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
    unique: true
  },

  vaccinated: {
    type: Boolean,
    default: false
  },

  healthStatus: {
    type: String,
    required: true,
    enum: ['Healthy', 'Needs Treatment', 'Under Observation'],
    default: 'Healthy'
  },

  notes: {
    type: String,
    default: ''
  },

  lastCheckupDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
