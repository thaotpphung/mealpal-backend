import mongoose from "mongoose";

const weekSchema = mongoose.Schema({
  weekName: { type: String, required: true },
  planid: { type: String, required:  true},
  days: [
    {
      weekDay:  { type: String, required:  true},
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