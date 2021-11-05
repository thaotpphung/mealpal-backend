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
  select: 'avatar',
});
exports.deleteRecipe = catchAsync(async (req, res, next) => {
  const doc = await Recipe.findByIdAndDelete(req.params.id);
  await Week.updateMany(
    { userId: req.params.userId },
    { $pull: [{ 'days.$.meals': { _id: req.params.id } }] }
  );

  if (!doc) {
    return next(new AppError('Info not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: null,
    message: 'Info deleted successfully',
  });
});
exports.createRecipe = catchAsync(async (req, res) => {
  const recipe = await RecipeService.createRecipe(req.body, req.userId);
  res.status(201).json({
    status: 'success',
    data: recipe,
    message: 'Info created successfully',
  });
});
