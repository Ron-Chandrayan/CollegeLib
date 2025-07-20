const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:String,
  PRN:String,
  password:String
});

const Users = mongoose.model('Users', UserSchema);
module.exports=Users;