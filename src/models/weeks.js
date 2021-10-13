const mongoose = require('mongoose');

const weekSchema = mongoose.Schema({
  weekName: { type: String, required: true },
  weekDescription: { type: String, default: '' },
  planId: { type: String },
  userId: { type: String, required: true },
  weekTags: { type: [String], default: [] },
  weekDiet: { type: String, default: '' },
});

const Week = mongoose.model('Week', weekSchema);

module.exports = Week;
