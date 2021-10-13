const mongoose = require('mongoose');

const daySchema = mongoose.Schema({
  weekId: { type: String, required: true },
  dayName: { type: String, required: true },
});

const Day = mongoose.model('Day', daySchema);

module.exports = Day;
