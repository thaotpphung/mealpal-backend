const express = require('express');
const mongoose = require('mongoose');
const Plan = require('../models/plans.js');
const router = express.Router();

exports.createPlan = async (req, res) => {
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

exports.getPlanListByUserId = async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.userId });
    res.status(200).json(plans);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await Plan.findById(id);

    res.status(200).json(plan);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No plan with id: ${id}`);
  await Plan.findByIdAndRemove(id);
  res.json({ message: 'Plan deleted successfully.' });
};
