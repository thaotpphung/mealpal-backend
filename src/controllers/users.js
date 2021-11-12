const User = require('../models/users.js');
const catchAsync = require('../utils/catchAsync');
const factory = require('./index');
const AppError = require('./../errors/AppError');
const APIFeatures = require('../utils/apiFeatures');
const Email = require('../utils/email');

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

// Send cart to user's email
exports.sendCart = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  const response = await new Email(user).sendCart({
    cart: req.body,
    date: new Date().toLocaleString('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  });
  if (response === 'success') {
    res.status(200).json({
      data: null,
      status: 'success',
      message:
        'Your shopping list was successfully sent to your email, please check your inbox including spam folder',
    });
  } else {
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});
