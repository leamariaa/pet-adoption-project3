const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },

  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },

  password: { 
    type: String, 
    required: true 
  },

  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },

  adoptedPets: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
