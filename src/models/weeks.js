const mongoose = require('mongoose');

const weekSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Week's name is required"],
      maxlength: [40, 'Must have less than or equal to 40 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [200, 'Must have less than or equal to 200 characters'],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: { type: [String], default: [] },
    calories: {
      type: Number,
      default: 0,
      min: 0,
      max: [10000, 'Must be less than or equal to 10000'],
    },
    likeCount: { type: Number, default: 0 },
    days: [
      {
        name: {
          type: String,
          required: true,
          maxlength: [40, 'Must have less than or equal to 40 characters'],
        },
        meals: [
          {
            name: {
              type: String,
              required: true,
              maxlength: [40, 'Must have less than or equal to 40 characters'],
            },
            recipes: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recipe',
              },
            ],
            food: [
              {
                amount: {
                  whole: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: [10000, 'Must be less than or equal to 10000'],
                  },
                  numer: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: [10000, 'Must be less than or equal to 10000'],
                  },
                  denom: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: [10000, 'Must be less than or equal to 10000'],
                  },
                  toString: {
                    type: String,
                    required: true,
                    maxlength: [
                      40,
                      'Must have less than or equal to 40 characters',
                    ],
                  },
                },
                ingredientName: {
                  type: String,
                  required: true,
                  maxlength: [
                    200,
                    'Must have less than or equal to 200 characters',
                  ],
                },
                unit: {
                  label: {
                    type: String,
                    required: true,
                    maxlength: [
                      20,
                      'Must have less than or equal to 20 characters',
                    ],
                  },
                },
                calPerUnit: {
                  type: Number,
                  required: true,
                  min: 0,
                  max: [10000, 'Must be less than or equal to 10000'],
                },
              },
            ],
          },
        ],
      },
    ],
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

const Week = mongoose.model('Week', weekSchema);

module.exports = Week;
