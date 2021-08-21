import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  password: { type: String },
  plans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan"
    }
  ],
  defaultPlan: { type: String },
  defaultWeek: { type: String },
});

export default mongoose.model("User", userSchema);