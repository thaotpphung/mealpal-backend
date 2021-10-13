const express = require('express');
const mongoose = require('mongoose');
const Day = require('../models/days.js');
const Meal = require('../models/meals.js');
const Recipe = require('../models/meals.js');

const router = express.Router();

exports.getDayListByWeekId = async (req, res) => {
  try {
    let days = await Day.find({ weekId: req.params.weekId }).lean();
    await Promise.all(
      days.map(async (day) => {
        let meals = await Meal.find({ dayId: day._id }).populate('food').lean();
        day.meals = meals;
      })
    );
    res.status(200).json(days);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
