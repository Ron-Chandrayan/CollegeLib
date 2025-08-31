const mongoose = require('mongoose');

const feStudentSchema = new mongoose.Schema({
  PRN: { type: String, required: true, unique: true },
  batch: { type: String, required: false },
  name: { type: String, required: true },
  division: { type: String, required: false },
  email: { type: String, required: true },
});

const FeStudent = mongoose.model('fe_students', feStudentSchema);

module.exports = FeStudent;
 
