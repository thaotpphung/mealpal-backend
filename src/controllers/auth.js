const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/users.js');
const authUtils = require('../utils/authUtils.js');
const catchAsync = require('../utils/catchAsync');
dotenv.config();

exports.signin = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).populate('currentWeek').exec();
  if (!user) {
    return res.status(404).json({ message: "User doesn't exist" });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      result: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        username: user.username,
        _id: user._id,
      },
      token: authUtils.getToken(user),
    },
    message: 'Successfully logged in',
  });
});

exports.register = catchAsync(async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  const oldUser = await User.findOne({
    $or: [{ username }, { email }],
  }).exec();
  if (oldUser) return res.status(400).json({ message: 'User already exists' });
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });
  await user.save();
  res.status(201).json({
    status: 'success',
    data: {
      result: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        username: user.username,
        _id: user._id,
      },
      token: authUtils.getToken(user),
    },
    message: 'Successfully signed up',
  });
});
