const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  PRN: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{3}[A-Za-z][A-Za-z0-9][0-9]{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid PRN!`
    }
  },
  password: String
});

const Users = mongoose.model('Users', UserSchema);
module.exports = Users;
