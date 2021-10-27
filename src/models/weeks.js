const mongoose = require('mongoose');

const weekSchema = mongoose.Schema({
  weekName: { type: String, required: [true, "Week's name is required"] },
  weekDescription: { type: String, default: '' },
  userId: { type: String, required: true },
  weekTags: { type: [String], default: [] },
  weekDiet: { type: String, required: [true, 'Week diet is required'] },
  caloGoal: { type: Number },
  planTag: { type: String },
  days: [
    {
      dayName: { type: String },
      meals: [
        {
          mealName: { type: String },
          food: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Recipe',
            },
          ],
          mealOrder: { type: Number },
        },
      ],
    },
  ],
});

const Week = mongoose.model('Week', weekSchema);

module.exports = Week;
