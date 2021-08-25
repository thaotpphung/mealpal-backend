import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  password: { type: String },
  currentPlan: { type: String },
  currentWeek: { type: String },
});

export default mongoose.model("User", userSchema);