const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('../models/recipes.js');
const Week = require('../models/weeks.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../errors/AppError');
const factory = require('./index');
const RecipeService = require('../services/recipes.js');

exports.getAllRecipes = factory.getAll(Recipe);
exports.updateRecipe = factory.updateOne(Recipe);
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
    recipe = await Recipe.findById(req.body.recipeId).exec(function (err, doc) {
      doc._id = mongoose.Types.ObjectId();
      doc.isNew = true;
      doc.userId = req.userId;
      doc.save(callback(doc));
    });
  } else {
    recipe = await RecipeService.createRecipe(req.body, req.userId);
    callback(recipe);
  }
});
