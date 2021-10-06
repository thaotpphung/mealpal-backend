import mongoose from 'mongoose';

const recipeSchema = mongoose.Schema({
  userId: { type: String },
  recipeName: { type: String, required: true },
  recipeIngredients: [
    {
      name: String,
      quantity: Number,
    },
  ],
  recipeInstructions: { type: [String], default: [] },
});

export default mongoose.model('Recipe', recipeSchema);
