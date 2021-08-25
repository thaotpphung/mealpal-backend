import express from 'express';
import mongoose from 'mongoose';
import Week from '../models/weeks.js';
const router = express.Router();

export const getWeeksByPlanId = async (req, res) => { 
    try {
        const weeks = await Week.find({ planId: req.params.planId });

        res.status(200).json(weeks);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createWeek = async (req, res) => {
  const week = req.body;
  const newWeek = new Week({ ...week});
  try {
      await newWeek.save();
      res.status(201).json(newWeek);
      console.log("Success saved new week", newWeek)
  } catch (error) {
      console.log(error);
      res.status(409).json({ message: error.message });
  }
}


export default router;