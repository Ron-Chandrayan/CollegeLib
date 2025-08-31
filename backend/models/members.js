const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({

  PRN: String,
  name: String,
  purpose: String
  

},{
  timestamps: true // 👈 Automatically adds createdAt and updatedAt
});

const members = mongoose.model('members', memberSchema);
module.exports=members
 