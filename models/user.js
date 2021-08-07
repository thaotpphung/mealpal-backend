import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: { type: String, required:  true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  plans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan"
    }
  ]
});

export default mongoose.model("User", userSchema);