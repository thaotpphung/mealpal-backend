const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  userId: { type: String },
  recipeName: { type: String, required: true },
  recipeDescription: { type: String, default: '' },
  ingredients: { type: [String], default: [] },
  instructions: { type: [String], default: [] },
  calories: { type: String, default: '' },
  servings: { type: String, default: '' },
  prepTime: { type: String, default: '' },
  cookTime: { type: String, default: '' },
  recipeImage: { type: String },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
