const Week = require('../models/weeks.js');
const catchAsync = require('../utils/catchAsync');
const factory = require('./index');
const WeekService = require('../services/weeks.js');

exports.getAllWeeks = factory.getAll(Week);

exports.getWeek = catchAsync(async (req, res) => {
  let week = await Week.findById(req.params.id).populate({
    path: 'days',
    populate: {
      path: 'meals',
      populate: {
        path: 'food',
        model: 'Recipe',
        select: 'recipeName',
      },
    },
  });
  res.status(201).json({
    status: 'success',
    data: week,
    message: 'Deleted week successfully',
  });
});

exports.createWeek = catchAsync(async (req, res) => {
  const week = req.body;
  const newWeek = await WeekService.createWeek(week, req.userId);
  res.status(201).json({
    status: 'success',
    data: newWeek,
    message: 'Created week successfully',
  });
});

exports.deleteWeek = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Week.findByIdAndRemove(id);
  res.status(200).json({
    status: 'success',
    data: null,
    message: 'Deleted week successfully',
  });
});

exports.updateWeekByDay = catchAsync(async (req, res) => {
  const { id, dayIdx } = req.params;
  const week = await Week.findById(id);
  week.days[dayIdx] = req.body;
  week.save();
  res.status(200).json({
    status: 'success',
    data: week,
    message: 'Updated week successfully',
  });
});

exports.updateWeek = catchAsync(async (req, res) => {
  const { id } = req.params;
  const week = await Week.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    data: week,
    message: 'Updated week successfully',
  });
});
