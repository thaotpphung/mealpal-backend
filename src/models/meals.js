import mongoose from "mongoose";

const mealSchema = mongoose.Schema({
  mealName: { type: String, required:  true },
  food: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe"
    }
  ]
});

export default mongoose.model("Meal", mealSchema);