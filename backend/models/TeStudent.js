const mongoose = require('mongoose');

const teStudentSchema = new mongoose.Schema({
  PRN: { type: String, required: true, unique: true },
  batch: { type: String, required: false },
  name: { type: String, required: true },
  division: { type: String, required: false },
  email: { type: String, required: true },
});

const TeStudent = mongoose.model('te_students', teStudentSchema);

module.exports = TeStudent;