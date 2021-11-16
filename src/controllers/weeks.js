const mongoose = require('mongoose');
const Week = require('../models/weeks.js');
const catchAsync = require('../utils/catchAsync');
const factory = require('./index');
const WeekService = require('../services/weeks.js');

exports.getAllWeeks = factory.getAll(Week);
exports.deleteWeek = factory.deleteOne(Week);
exports.updateWeek = factory.updateOne(Week);

exports.updateWeekByDay = catchAsync(async (req, res) => {
  const { id, dayIdx } = req.params;
  let week = await Week.findById(id);
  week.days[dayIdx] = req.body;
  week.save();
  res.status(200).json({
    status: 'success',
    data: null,
    message: 'Updated successfully',
  });
});

exports.getWeek = factory.getOne(Week, [
  {
    path: 'days',
    populate: {
      path: 'meals',
      populate: {
        path: 'food',
        model: 'Recipe',
        select: ['recipeName', 'ingredients', 'calories'],
      },
    },
  },
  { path: 'userId', model: 'User', select: ['avatar', 'username'] },
]);

exports.createWeek = catchAsync(async (req, res) => {
  const callback = (data) => {
    res.status(201).json({
      status: 'success',
      data: data,
      message: 'Saved successfully',
    });
  };
  let week;
  if (req.body.weekId) {
    week = await Week.findById(req.body.weekId).exec(function (err, doc) {
      doc._id = mongoose.Types.ObjectId();
      doc.isNew = true;
      doc.userId = req.userId;
      doc.save(callback(doc));
    });
  } else {
    week = await WeekService.createWeek(req.body, req.userId);
    callback(week);
  }
});
