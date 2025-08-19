const mongoose = require('mongoose');

const livefeedSchema = new mongoose.Schema({
  PRN: { type: String, required: true },
  name: { type: String, required: true },
  purpose: { type: String, default: "Study" },
  timestamp: { type: Date, default: Date.now }

});

// Explicitly tell Mongoose to use the "livefeed" collection
const LiveFeed = mongoose.model("LiveFeed", livefeedSchema, "livefeed");

module.exports = LiveFeed;
