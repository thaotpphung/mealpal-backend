const express = require('express');
const mongoose = require('mongoose');
const Day = require('../models/days.js');
const Meal = require('../models/meals.js');
const Recipe = require('../models/meals.js');

exports.getDayListByWeekId = async (req, res) => {
  try {
    let days = await Day.find({ weekId: req.params.weekId })
      .sort('dayOrder')
      .lean();
    await Promise.all(
      days.map(async (day) => {
        let meals = await Meal.find({ dayId: day._id })
          .populate('food', 'recipeName')
          .lean();
        day.meals = meals;
      })
    );
    res.status(200).json({ status: 'success', data: days, message: null });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getDay = async (req, res) => {
  try {
    const { dayId } = req.params;

    const meals = await Meal.find({ dayId }).populate('food').lean();
    const day = await Day.findById(dayId);
    const returnedDay = {
      _id: dayId,
      meals,
      dayName: day.dayName,
    };
    res
      .status(200)
      .json({ status: 'success', data: returnedDay, message: null });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
