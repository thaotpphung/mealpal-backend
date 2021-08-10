import mongoose from "mongoose";

const planSchema = mongoose.Schema({
  planName: { type: String, required:  true },
  userId: { type: String, required:  true },
  planDescription: { type: String },
  weeks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Week"
    }
  ],
  planCreatedTime: {
    type: Date,
    default: new Date(),
  },
  categories: { type: [String], default: [] },
  likes: { type: [String], default: [] }
});

export default mongoose.model("Plan", planSchema);