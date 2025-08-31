const mongoose = require('mongoose');

const lifetimeSchema = new mongoose.Schema({


  PRN: String,
  name: String,
  purpose: String,
  

},{
  timestamps: true //  Automatically adds createdAt and updatedAt
});

const lifetime = mongoose.model('lifetime', lifetimeSchema);
module.exports=lifetime;
 