import express from 'express';
import mongoose from 'mongoose';
import Week from '../models/weeks.js';
import Day from '../models/days.js';
const router = express.Router();

export const getWeekListByPlanId = async (req, res) => {
  try {
    // console.log('get week by plan id');
    // const newWeek = new Week({ weekName: 'test', planId: req.params.planId });
    // await createInitialDays(newWeek._id);
    // await newWeek.save();
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
  const meals = [
    { mealName: 'Breakfast', food: [] },
    { mealName: 'Lunch', food: [] },
    { mealName: 'Dinner', food: [] },
  ];
  try {
    weekDays.forEach(async (dayName) => {
      const newDay = new Day({ dayName, meals, weekId });
      await newDay.save();
    });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export const createWeek = async (req, res) => {
  const week = req.body;
  const newWeek = new Week({ ...week });
  await createInitialDays(newWeek._id);

  try {
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
