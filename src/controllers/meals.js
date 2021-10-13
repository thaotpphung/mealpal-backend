const express = require('express');
const mongoose = require('mongoose');
const Meal = require('../models/meals.js');
const router = express.Router();

exports.createMeal = async (req, res) => {
  try {
    const meal = req.body;
    const newMeal = await Meal.create({ ...meal });
    const mealReturned = {
      _id: newMeal._id,
      food: [],
      mealName: newMeal.mealName,
      dayId: newMeal.dayId,
    };
    res.status(201).json(mealReturned);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No meal with id: ${id}`);
    await Meal.findByIdAndRemove(id);
    res.json({ message: 'Meal deleted successfully.' });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

exports.updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No meal with id: ${id}`);
    const meal = await Meal.findByIdAndUpdate(
      id,
      {
        $set: { food: req.body },
      },
      { new: true }
    );
    res.json({ message: 'Meal updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};
