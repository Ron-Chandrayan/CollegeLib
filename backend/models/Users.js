const mongoose = require('mongoose');
//Hashing: Import bcrypt for password hashing
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: String,
  PRN: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{3}[A-Za-z][A-Za-z0-9][0-9]{3}$/.test(v);
      },
      message: props => `${props.value} is not a valid PRN!`
    }
  },
  password: String
});

//Hashing: Pre-save middleware to hash password before saving to database
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with salt rounds of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

//Hashing: Instance method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Users = mongoose.model('Users', UserSchema);
module.exports = Users;
