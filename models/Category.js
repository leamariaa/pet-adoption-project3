const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },

  pets: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
