const mongoose = require('mongoose');

const weekSchema = mongoose.Schema({
  weekName: { type: String, required: [true, "Week's name is required"] },
  weekDescription: { type: String, default: '' },
  planId: { type: String },
  userId: { type: String, required: true },
  weekTags: { type: [String], default: [] },
  weekDiet: { type: String, required: [true, 'Week diet is required'] },
  caloGoal: { type: Number },
});

const Week = mongoose.model('Week', weekSchema);

module.exports = Week;
