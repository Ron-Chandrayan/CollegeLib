const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.Mixed, // Can be string or object (for C1, C2, C3)
    required: true
  },
  subject_teacher: {
    type: mongoose.Schema.Types.Mixed, // Can be string or object
    default: null
  },
  classroom: {
    type: mongoose.Schema.Types.Mixed, // Can be string or object
    default: null
  }
}, { _id: false });

const timetableDaySchema = new mongoose.Schema({
  "09:15": { type: timeSlotSchema, required: false },
  "10:15": { type: timeSlotSchema, required: false },
  "11:15": { type: timeSlotSchema, required: false },
  "12:15": { type: timeSlotSchema, required: false },
  "13:00": { type: timeSlotSchema, required: false },
  "13:45": { type: timeSlotSchema, required: false },
  "14:45": { type: timeSlotSchema, required: false },
  "15:45": { type: timeSlotSchema, required: false }
}, { _id: false });

const timetableSchema = new mongoose.Schema({
  year: { type: String, required: true },
  branch: { type: String, required: true },
  division: { type: String, required: true },
  class_incharge: { type: String, required: true },
  last_updated: { type: String, required: true }, // Or use `Date` if preferred
  timetable: {
    monday: { type: timetableDaySchema, required: false },
    tuesday: { type: timetableDaySchema, required: false },
    wednesday: { type: timetableDaySchema, required: false },
    thursday: { type: timetableDaySchema, required: false },
    friday: { type: timetableDaySchema, required: false }
  }
});

const timetable = mongoose.model("Timetable", timetableSchema);
module.exports = timetable;
 
