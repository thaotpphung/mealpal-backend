import mongoose from "mongoose";

const recipeSchema = mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [
    {
      name: String,
      quantity: Number,
    },
  ],
  instructions: [{ type: String }]
});

export default mongoose.model("Recipe", userSchema);
