const mongoose = require('mongoose');

const daySchema = mongoose.Schema({
  weekId: { type: String, required: true },
  dayName: { type: String, required: true },
  dayOrder: { type: Number },
});

daySchema.set('toObject', { virtuals: true });
daySchema.set('toJSON', { virtuals: true });

daySchema.virtual('meals', {
  ref: 'Meal',
  foreignField: 'dayId',
  localField: '_id',
});

const Day = mongoose.model('Day', daySchema);

module.exports = Day;
