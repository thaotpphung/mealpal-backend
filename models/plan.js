import mongoose from "mongoose";

const planSchema = mongoose.Schema({
  name: { type: String, required:  true },
  userid: { type: String, required:  true },
  description: { type: String },
  weeks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Week"
    }
  ]

});

export default mongoose.model("Plan", planSchema);