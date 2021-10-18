const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('../models/recipes.js');
const Meal = require('../models/meals.js');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllRecipes = async (req, res) => {
  try {
    const count = await Recipe.estimatedDocumentCount({ userId: req.userId });
    const features = new APIFeatures(
      Recipe.find({ userId: req.userId }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      data: {
        count: count,
        data: doc,
      },
    });
  } catch (error) {
    console.log('error in get all recipes', error);
    res.status(404).json({ message: error.message });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({
      status: 'success',
      data: recipe,
      message: null,
    });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No recipe with id: ${id}`);
    await Meal.updateMany({ food: id }, { $pullAll: { food: [id] } });
    await Recipe.findByIdAndRemove(id);
    res.status(200).json({
      status: 'success',
      data: null,
      message: 'Deleted recipe successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No recipe with id: ${id}`);
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
      message: 'Deleted week successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    res.status(200).json({ status: 'success', data: recipe, message: null });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
