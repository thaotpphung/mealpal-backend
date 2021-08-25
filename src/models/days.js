import mongoose from "mongoose";

const daySchema = mongoose.Schema({
  weekId: { type: String, required: true },
  weekDay: { type: String, required:  true},
  meals: [
    {
      mealName: { type: String, required:  true},
      food: [
        {
          name: { type: String, required:  true},
        }
      ]
    }
  ]
});

export default mongoose.model("Week", weekSchema);