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
    ingredients: [
      {
        amount: {
          whole: { type: Number },
          numer: { type: Number },
          denom: { type: Number },
        },
        ingredientName: { type: String },
        unit: {
          label: { type: String },
        },
      },
    ],
    instructions: { type: [String], default: [''] },
    calories: {
      type: Number,
      default: 0,
      required: [true, 'Calories is required'],
    },
    servings: {
      type: Number,
      default: 0,
    },
    time: {
      type: String,
      default: '',
    },
    servingSize: {
      type: String,
      default: '',
    },
    recipeDiet: {
      type: String,
      maxlength: [40, 'Must have less or equal than 40 characters'],
      default: '',
    },
    recipeImage: { type: String, default: '' },
    updatedTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
