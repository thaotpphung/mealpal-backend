const User = require('../models/users.js');
const catchAsync = require('../utils/catchAsync');
const factory = require('./index');
const AppError = require('./../errors/AppError');

exports.updateUser = factory.updateOne(User, 'userId');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

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
