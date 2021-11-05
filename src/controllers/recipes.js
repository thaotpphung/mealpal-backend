const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('../models/recipes.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../errors/AppError');
const factory = require('./index');
const RecipeService = require('../services/recipes.js');

exports.getAllRecipes = factory.getAll(Recipe);
exports.deleteRecipe = factory.deleteOne(Recipe);
exports.updateRecipe = factory.updateOne(Recipe);
exports.getRecipe = factory.getOne(Recipe, {
  path: 'userId',
  model: 'User',
  select: 'avatar',
});
exports.createRecipe = catchAsync(async (req, res) => {
  const recipe = await RecipeService.createRecipe(req.body, req.userId);
  res.status(201).json({
    status: 'success',
    data: recipe,
    message: 'Created recipe successfully',
  });
});
