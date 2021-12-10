const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      maxlength: [40, 'Must have less or equal than 40 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [200, 'Must have less or equal than 200 characters'],
    },
    ingredients: [
      {
        amount: {
          whole: { type: Number },
          numer: { type: Number },
          denom: { type: Number },
          toString: { type: String },
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
    recipeImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    updatedTime: {
      type: Date,
      default: Date.now,
    },
    tags: { type: [String], default: [] },
    likeCount: { type: Number, default: 0 },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
