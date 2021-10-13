import express from 'express';
import mongoose from 'mongoose';
import Day from '../models/days.js';
import Meal from '../models/meals.js';
import Recipe from '../models/meals.js';

const router = express.Router();

export const getDayListByWeekId = async (req, res) => {
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

export default router;
