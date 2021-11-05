const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    recipeName: {
      type: String,
      required: [true, 'Recipe name is required'],
      maxlength: [40, 'Must have less or equal than 40 characters'],
    },
    recipeDescription: {
      type: String,
      default: '',
      maxlength: [100, 'Must have less or equal than 40 characters'],
    },
    ingredients: {
      type: [
        {
          whole: { type: Number },
          numer: { type: Number },
          denom: { type: Number },
          food: { type: String },
          unit: {
            label: { type: String },
          },
        },
      ],
    },
    instructions: { type: [String], default: ['[Step 1]'] },
    calories: {
      type: Number,
      default: 0,
      required: [true, 'Calories is required'],
    },
    servings: {
      type: Number,
      default: 0,
      required: [true, 'Servings is required'],
    },
    prepTime: {
      type: Number,
      default: 0,
    },
    cookTime: {
      type: Number,
      default: 0,
    },
    recipeDiet: {
      type: String,
      maxlength: [40, 'Must have less or equal than 40 characters'],
    },
    recipeImage: { type: String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
