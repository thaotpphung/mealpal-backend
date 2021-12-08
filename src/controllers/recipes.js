const express = require('express');
const User = require('../models/users.js');
const mongoose = require('mongoose');
const { cloudinary } = require('../utils/cloudinary');
const Recipe = require('../models/recipes.js');
const Week = require('../models/weeks.js');
const catchAsync = require('../utils/catchAsync');
const { resizeBase64 } = require('../middlewares/image');
const AppError = require('./../errors/AppError');
const factory = require('./index');
const RecipeService = require('../services/recipes.js');

exports.getAllRecipes = factory.getAll(Recipe);
exports.deleteRecipes = factory.deleteMany(Recipe);

exports.updateRecipe = catchAsync(async (req, res, next) => {
  // check for recipeImage change
  let recipe;
  if (req.body.recipeImage) {
    // delete existing image
    recipe = await Recipe.findById(req.params.id);
    if (recipe.recipeImage.url) {
      cloudinary.uploader.destroy(
        recipe.recipeImage.publicId,
        function (error, result) {
          if (error) {
            return next(
              new AppError('Error when processing image, please try again', 500)
            );
          }
        }
      );
    }
    if (!recipe) {
      return next(new AppError('Resource not found', 404));
    }
    // upload new image
    // 1. resize image
    const image = await resizeBase64(req.body.recipeImage);
    // 2. upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    // 3. save url string to recipe image
    req.body.recipeImage = {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  }
  // update recipe
  recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    { $set: { ...req.body, updatedTime: new Date() } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!recipe) {
    return next(new AppError('Resource not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { recipeImage: recipe.recipeImage },
    message: 'Updated successfully',
  });
});

exports.getRecipe = factory.getOne(Recipe, {
  path: 'userId',
  model: 'User',
  select: ['avatar', 'username'],
});

exports.deleteRecipe = catchAsync(async (req, res, next) => {
  const doc = await Recipe.findByIdAndDelete(req.params.id);
  await Week.updateMany(
    { userId: req.params.userId },
    { $pull: [{ 'days.$.meals': { _id: req.params.id } }] }
  );
  if (!doc) {
    return next(new AppError('Resource not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: null,
    message: 'Deleted successfully',
  });
});

exports.createRecipe = catchAsync(async (req, res) => {
  const callback = (data) => {
    res.status(201).json({
      status: 'success',
      data: data,
      message: 'Saved successfully',
    });
  };
  let recipe;
  if (req.body.recipeId) {
    recipe = await Recipe.findById(req.body.recipeId).exec(async function (
      err,
      doc
    ) {
      doc._id = mongoose.Types.ObjectId();
      doc.isNew = true;
      const user = await User.findById(req.userId).select({
        username: 1,
        avatar: 1,
      });
      doc.userId = user;
      doc.save(callback(doc));
    });
  } else {
    recipe = await RecipeService.createRecipe(req.body, req.userId);
    callback(recipe);
  }
});
