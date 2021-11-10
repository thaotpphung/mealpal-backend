const mongoose = require('mongoose');

const weekSchema = mongoose.Schema(
  {
    weekName: {
      type: String,
      required: [true, "Week's name is required"],
    },
    weekDescription: { type: String, default: '' },
    userId: { type: String, required: true },
    weekTags: { type: [String], default: [] },
    weekDiet: { type: String, required: [true, 'Week diet is required'] },
    caloGoal: { type: Number, default: 0 },
    planTag: { type: String },
    days: [
      {
        dayName: { type: String },
        calories: { type: Number, default: 0 },
        meals: [
          {
            mealName: { type: String },
            food: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recipe',
              },
            ],
            calories: { type: Number, default: 0 },
          },
        ],
      },
    ],
    updatedTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Week = mongoose.model('Week', weekSchema);

module.exports = Week;
