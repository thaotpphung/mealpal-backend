const express = require('express');
const mongoose = require('mongoose');
const Week = require('../models/weeks.js');
const Day = require('../models/days.js');
const Meal = require('../models/meals.js');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllWeeks = async (req, res) => {
  try {
    const count = await Week.estimatedDocumentCount({ userId: req.userId });
    console.log('query', req.query);
    const features = new APIFeatures(
      Week.find({ userId: req.userId }),
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
        count,
        data: doc,
        currentCount: doc.length,
      },
    });
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
    weekDays.forEach(async (dayName, dayIdx) => {
      const newDay = new Day({ dayName, weekId, dayOrder: dayIdx + 1 });
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
    res.status(201).json({
      status: 'success',
      data: newWeek,
      message: 'Deleted week successfully',
    });
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
    res.status(200).json({
      status: 'success',
      data: null,
      message: 'Deleted week successfully',
    });
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
    res.status(201).json({
      status: 'success',
      data: week,
      message: 'Deleted week successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

exports.getWeek = async (req, res) => {
  // for each day, populate the meals
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
    let weeks = await Week.find();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
