const User = require('../models/users.js');
const catchAsync = require('../utils/catchAsync');
const factory = require('./index');
const AppError = require('./../errors/AppError');
const APIFeatures = require('../utils/apiFeatures');

exports.updateUser = catchAsync(async (req, res, next) => {
  let user;
  if (req.body.email) {
    user = await User.findOne(req.body);
    if (!!user) {
      return next(new AppError(`Email must be unique`, 404));
    }
  }
  user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { ...req.body, updatedTime: new Date() } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(new AppError('Resource not found', 404));
  }
  if (req.body.email) {
    user.isVerified = false;
    user.save();
  }

  res.status(200).json({
    status: 'success',
    data: user,
    message: 'Updated successfully',
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    User.findById(req.params.userId),
    req.query
  ).limitFields();

  const user = await features.query;

  if (!user) {
    return next(new AppError('Resource not found', 404));
  }

  user.email = undefined;

  res.status(200).json({
    status: 'success',
    data: user,
    message: null,
  });
});

exports.updateAvatar = catchAsync(async (req, res) => {});
