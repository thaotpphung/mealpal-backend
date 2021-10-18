const mongoose = require('mongoose');

const daySchema = mongoose.Schema(
  {
    weekId: { type: String, required: [true, 'weekId is required'] },
    dayName: {
      type: String,
      required: [true, 'dayName is required'],
      maxlength: [40, 'Must have less or equal than 40 characters'],
    },
    dayOrder: { type: Number },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
daySchema.virtual('meals', {
  ref: 'Meal',
  foreignField: 'dayId',
  localField: '_id',
});

const Day = mongoose.model('Day', daySchema);

module.exports = Day;
