const mongoose = require('mongoose');

const footfallSchema = new mongoose.Schema({
    no:  String,
  count: Number,
  timestamp: { type: Date, default: Date.now }
});

const totalfootfall = mongoose.model('totalfootfall', footfallSchema);
module.exports=totalfootfall;
 