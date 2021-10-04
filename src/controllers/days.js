import express from "express";
import mongoose from "mongoose";
import Day from "../models/days.js";
const router = express.Router();

export const getDayListByWeekId = async (req, res) => {
  try {
    const days = await Day.find({ weekId: req.params.weekId });
    res.status(200).json(days);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
