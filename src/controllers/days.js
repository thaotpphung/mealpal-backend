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
        let meals = await Meal.find({ dayId: day._id }).lean();
        await Promise.all(
          meals.map(async (meal) => {
            const food = await Recipe.find({ mealId: meal._id });
            meal.food = food;
          })
        );
        day.meals = meals;
      })
    );
    res.status(200).json(days);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateDay = async (req, res) => {
  const { dayId } = req.params;
  const meals = req.body;
  if (!mongoose.Types.ObjectId.isValid(dayId))
    return res.status(404).send(`No plan with id: ${dayId}`);

  try {
    meals.forEach(async (meal) => {
      meal.food.forEach(async (recipe) => {
        const newRecipe = new Recipe({
          userId: req.userId,
          recipeName: recipe,
        });
        await newRecipe.save();
      });
    });
  } catch (error) {
    console.log(error);
  }

  const day = await Day.findByIdAndUpdate(
    dayId,
    {
      $set: { meals: meals },
    },
    { new: true }
  );
  res.status(200).json({ message: 'success' });
};

export default router;
