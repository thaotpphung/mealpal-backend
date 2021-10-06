import express from 'express';
import mongoose from 'mongoose';
import Week from '../models/weeks.js';
import Day from '../models/days.js';
import Meal from '../models/meals.js';

const router = express.Router();

export const getWeekListByPlanId = async (req, res) => {
  try {
    const weeks = await Week.find({ planId: req.params.planId });
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
      initalMeals.forEach(async (mealName) => {
        await Meal.create({ mealName, dayId: newDay._id });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export const createWeek = async (req, res) => {
  const week = req.body;
  const newWeek = new Week({ ...week });
  try {
    await createInitialDays(newWeek._id);
    await newWeek.save();
    res.status(201).json(newWeek);
    console.log('Success saved new week', newWeek);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export const deleteWeek = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No week with id: ${id}`);
    await Week.findByIdAndRemove(id);
    res.json({ message: 'Week deleted successfully.' });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export default router;
