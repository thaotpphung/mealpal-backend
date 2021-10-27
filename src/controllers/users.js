const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/users.js');
const Week = require('../models/weeks.js');
const catchAsync = require('../utils/catchAsync');

exports.updateUser = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(
    req.userId,
    {
      $set: req.body,
    },
    {
      new: true,
    }
  );
  res.status(204).json({
    status: 'success',
    data: {},
    message: 'Successfully updated user',
  });
});
