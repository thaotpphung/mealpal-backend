const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  userId: { type: String },
  recipeName: {
    type: String,
    required: [true, "Recipe's name is required"],
    maxlength: [40, 'Must have less or equal than 40 characters'],
  },
  recipeDescription: {
    type: String,
    default: '',
    maxlength: [100, 'Must have less or equal than 40 characters'],
  },
  ingredients: { type: [String], default: [] },
  instructions: { type: [String], default: [] },
  calories: { type: Number, default: 0 },
  servings: { type: Number, default: 0 },
  prepTime: {
    type: Number,
    default: 0,
  },
  cookTime: {
    type: Number,
    default: 0,
  },
  recipeDiet: { type: String },
  recipeImage: { type: String },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
