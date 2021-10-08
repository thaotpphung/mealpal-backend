import mongoose from 'mongoose';

const mealSchema = mongoose.Schema({
  mealName: { type: String, required: true },
  dayId: { type: String, required: true },
  food: [{}],
});

export default mongoose.model('Meal', mealSchema);
