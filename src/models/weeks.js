import mongoose from "mongoose";

const weekSchema = mongoose.Schema({
  weekName: { type: String, required: true },
  planId: { type: String, required:  true},
  days: [
    {
      weekDay:  { type: String},
      meals: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Meal"
        }
      ]
    }
  ],
});

export default mongoose.model("Week", weekSchema);