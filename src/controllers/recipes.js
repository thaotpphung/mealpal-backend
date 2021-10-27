const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('../models/recipes.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../errors/AppError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./index');

exports.getAllRecipes = factory.getAll(Recipe);

exports.createRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.create({ ...req.body, userId: req.userId });
  res.status(201).json({
    status: 'success',
    data: recipe,
    message: null,
  });
});

exports.deleteRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Recipe.findByIdAndRemove(id);
  res.status(200).json({
    status: 'success',
    data: null,
    message: 'Deleted recipe successfully',
  });
});

exports.updateRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipe.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  );
  res.status(201).json({
    status: 'success',
    data: recipe,
    message: 'Deleted recipe successfully',
  });
});

exports.getRecipe = catchAsync(async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);
  res.status(200).json({ status: 'success', data: recipe, message: null });
});
