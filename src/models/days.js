import mongoose from "mongoose";

const daySchema = mongoose.Schema({
  weekId: { type: String, required: true },
  dayName: { type: String, required:  true},
  meals: [
    {
      mealName: { type: String, required:  true},
      food: [
        {
          foodName: { type: String, required:  true},
        }
      ]
    }
  ]
});

export default mongoose.model("Day", daySchema);