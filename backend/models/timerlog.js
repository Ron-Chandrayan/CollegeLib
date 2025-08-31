const mongoose = require('mongoose');

const timerlogSchema = new mongoose.Schema({
  PRN:{type:String, unique:true},
  seconds:Number
});

const timerlog = mongoose.model('timerlog', timerlogSchema);
module.exports=timerlog;
 