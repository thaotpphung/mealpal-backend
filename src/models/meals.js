const mongoose = require('mongoose');

const mealSchema = mongoose.Schema({
  mealName: { type: String, required: true },
  dayId: { type: mongoose.Schema.Types.ObjectId, required: true },
  weekId: { type: mongoose.Schema.Types.ObjectId, required: true },
  food: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
    },
  ],
  mealOrder: { type: Number },
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
