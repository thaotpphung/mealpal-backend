import express from 'express';
import mongoose from 'mongoose';
import Recipe from '../models/recipes.js';
import Meal from '../models/meals.js';

const router = express.Router();

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.userId });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No recipe with id: ${id}`);
    await Meal.updateMany({ food: id }, { $pullAll: { food: [id] } });
    await Recipe.findByIdAndRemove(id);
    res.json({ message: 'Recipe deleted successfully.' });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No recipe with id: ${id}`);
    const recipe = await Recipe.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.json({ message: 'Recipe updated successfully', data: recipe });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export default router;
