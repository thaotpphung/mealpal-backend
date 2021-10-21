const express = require('express');
const mongoose = require('mongoose');
const Week = require('../models/weeks.js');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllWeeks = async (req, res) => {
  try {
    // get all weeks by user id or by everyone
    let filter = {};
    if (req.query.id) filter = { userId: req.userId };
    const count = await Week.estimatedDocumentCount(filter);
    const features = new APIFeatures(Week.find(filter), req.query)
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

exports.getWeek = async (req, res) => {
  try {
    let week = await Week.findById(req.params.id).populate({
      path: 'days',
      populate: {
        path: 'meals',
        populate: {
          path: 'food',
          model: 'Recipe',
          select: 'recipeName',
        },
      },
    });
    res.status(201).json({
      status: 'success',
      data: week,
      message: 'Deleted week successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.createWeek = async (req, res) => {
  const week = req.body;
  const newWeek = new Week({ ...week, userId: req.userId });
  try {
    const days = await createInitialDays();
    newWeek.days = days;
    await newWeek.save();
    res.status(201).json({
      status: 'success',
      data: newWeek,
      message: null,
    });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

exports.deleteWeek = async (req, res) => {
  try {
    const { id } = req.params;
    await Week.findByIdAndRemove(id);
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

exports.updateWeekByDay = async (req, res) => {
  try {
    const { id, dayIdx } = req.params;
    const week = await Week.findById(id);
    week.days[dayIdx] = req.body;
    week.save();
    res.status(200).json({
      status: 'success',
      data: {
        data: week,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

exports.updateWeek = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayIdx, day } = req.body;
    const week = await Week.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        data: week,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

const createInitialDays = async () => {
  const meals = ['Break Fast', 'Lunch', 'Dinner'];
  let initialMeals = [];
  meals.forEach((meal, idx) => {
    initialMeals.push({
      mealName: meal,
      order: idx,
      food: [],
    });
  });
  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  let initialDays = [];
  weekDays.forEach((day) => {
    initialDays.push({
      dayName: day,
      meals: initialMeals,
    });
  });
  return initialDays;
};
