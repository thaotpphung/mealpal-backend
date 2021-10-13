const mongoose = require('mongoose');

const mealSchema = mongoose.Schema({
  mealName: { type: String, required: true },
  dayId: { type: String, required: true },
  weekId: { type: String, required: true },
  food: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
    },
  ],
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
