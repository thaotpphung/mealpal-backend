import mongoose from "mongoose";

const weekSchema = mongoose.Schema({
  weekName: { type: String, required: true },
  planId: { type: String, required:  true}
});

export default mongoose.model("Week", weekSchema);