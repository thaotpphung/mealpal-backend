const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/users.js');
const Week = require('../models/weeks.js');
const catchAsync = require('../utils/catchAsync');
const factory = require('./index');

exports.updateUser = factory.updateOne(User, 'userId');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('Info not found', 404));
  }
  user.email = undefined;

  res.status(200).json({
    status: 'success',
    data: user,
    message: null,
  });
});

exports.updateAvatar = catchAsync(async (req, res) => {});
