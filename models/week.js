import mongoose from "mongoose";

const weekSchema = mongoose.Schema({
  name: { type: String, required: true },
  planid: { type: String, required:  true},
  days: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal"
    }
  ]
});

export default mongoose.model("Week", weekSchema);