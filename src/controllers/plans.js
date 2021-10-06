import express from 'express';
import mongoose from 'mongoose';
import Plan from '../models/plans.js';
const router = express.Router();

export const createPlan = async (req, res) => {
  const plan = req.body.plan;
  const newPlan = new Plan({
    ...plan,
    userId: req.userId,
    planCreatedTime: new Date().toISOString(),
  });
  try {
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getPlanListByUserId = async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.userId });
    res.status(200).json(plans);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await Plan.findById(id);

    res.status(200).json(plan);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updatePlan = async (req, res) => {
  // const { id } = req.params;
  // const { title, message, creator, selectedFile, tags } = req.body;
  // if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No plan with id: ${id}`);
  // const updatedPlan = { creator, title, message, tags, selectedFile, _id: id };
  // await Plan.findByIdAndUpdate(id, updatedPlan, { new: true });
  // res.json(updatedPlan);
};

export const deletePlan = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No plan with id: ${id}`);
  await Plan.findByIdAndRemove(id);
  res.json({ message: 'Plan deleted successfully.' });
};

export default router;
