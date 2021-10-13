const express = require('express');
const mongoose = require('mongoose');
const Week = require('../models/weeks.js');
const Day = require('../models/days.js');
const Meal = require('../models/meals.js');

const router = express.Router();

exports.getAllWeeks = async (req, res) => {
  try {
    const weeks = await Week.find({ userId: req.userId });
    res.status(200).json(weeks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createInitialDays = async (weekId) => {
  const weekDays = [
    'Monday',
    'Tuesday',
    'WednesDay',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const initalMeals = ['Break Fast', 'Lunch', 'Dinner'];
  try {
    weekDays.forEach(async (dayName) => {
      const newDay = new Day({ dayName, weekId });
      await newDay.save();
      await Promise.all(
        initalMeals.map(async (mealName) => {
          await Meal.create({ mealName, dayId: newDay._id, weekId });
        })
      );
    });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

exports.createWeek = async (req, res) => {
  const week = req.body;
  const newWeek = new Week({ ...week });
  try {
    await createInitialDays(newWeek._id);
    await newWeek.save();
    res.status(201).json(newWeek);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

exports.deleteWeek = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No week with id: ${id}`);
    await Week.findByIdAndRemove(id);
    await Day.deleteMany({ weekId: id });
    await Meal.deleteMany({ weekId: id });
    await res.json({ message: 'Week deleted successfully.' });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

exports.updateWeek = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No week with id: ${id}`);
    const week = await Week.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    console.log('update week', week);
    res.json({ message: 'Week updated successfully', data: week });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};
