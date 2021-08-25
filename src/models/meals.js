import mongoose from "mongoose";

const mealSchema = mongoose.Schema({
  mealName: { type: String, required:  true },
  dayId: { type: String, required:  true }
});

export default mongoose.model("Meal", mealSchema);