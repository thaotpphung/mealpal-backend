import mongoose from "mongoose";

const daySchema = mongoose.Schema({
  weekId: { type: String, required: true },
  planid: { type: String, required:  true},
  weekDay: { type: String, required:  true},
  meals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal"
    }
  ]
});

export default mongoose.model("Week", weekSchema);