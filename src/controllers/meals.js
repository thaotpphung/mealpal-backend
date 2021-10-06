import express from 'express';
import mongoose from 'mongoose';
import Meal from '../models/meals.js';
const router = express.Router();

export const createMeal = async (req, res) => {
  try {
    const meal = req.body;
    const newMeal = await Meal.create({ ...meal });
    console.log('created meal', newMeal);
    const mealReturned = {
      _id: newMeal._id,
      food: ['currey'],
      mealName: newMeal.mealName,
      dayId: newMeal.dayId,
    };
    res.status(201).json(mealReturned);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export const deleteMeal = async (req, res) => {
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

export default router;
