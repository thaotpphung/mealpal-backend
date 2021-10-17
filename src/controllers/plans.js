const express = require('express');
const mongoose = require('mongoose');
const Plan = require('../models/plans.js');

exports.createPlan = async (req, res) => {
  const plan = req.body.plan;
  const newPlan = new Plan({
    ...plan,
    userId: req.userId,
    planCreatedTime: new Date().toISOString(),
  });
  try {
    await newPlan.save();
    res.status(201).json({
      status: 'success',
      data: newPlan,
      message: 'Created plan successfully',
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.getPlanListByUserId = async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.userId });
    res.status(200).json({
      status: 'success',
      data: plans,
      message: null,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await Plan.findById(id);

    res.status(200).json({
      status: 'success',
      data: plan,
      message: null,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No plan with id: ${id}`);
    await Plan.findByIdAndRemove(id);
    res.json({
      status: 'success',
      data: null,
      message: 'Deleted plan successfully',
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
