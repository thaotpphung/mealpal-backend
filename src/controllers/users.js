const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/users.js');
const Week = require('../models/weeks.js');
const catchAsync = require('../utils/catchAsync');

exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      $set: req.body,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: user,
    message: `Successfully updated user!`,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json({ status: 'success', data: recipe, message: null });
});

exports.updateAvatar = catchAsync(async (req, res) => {});
