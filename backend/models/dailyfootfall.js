const mongoose = require('mongoose');

const footfallSchema = new mongoose.Schema({
  count: Number,
  timestamp: { type: Date, default: Date.now }
});

const dailyfootfall = mongoose.model('dailyfootfall', footfallSchema);
module.exports=dailyfootfall;
 