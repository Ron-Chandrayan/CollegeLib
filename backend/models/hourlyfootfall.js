const mongoose = require('mongoose');

const footfallSchema = new mongoose.Schema({
  count: Number,
  timestamp: { type: Date, default: Date.now }
});

const hourlyfootfall = mongoose.model('hourlyfootfall', footfallSchema);
module.exports=hourlyfootfall;