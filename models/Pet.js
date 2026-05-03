const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },

  age: { 
    type: Number, 
    required: true,
    min: 0
  },

  type: { 
    type: String, 
    required: true,
    trim: true
  },

  adopted: { 
    type: Boolean, 
    default: false 
  },

  adoptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],

  medicalRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
