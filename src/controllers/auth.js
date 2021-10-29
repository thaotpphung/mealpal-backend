const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/users.js');
const authService = require('../services/auth.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../errors/AppError');
const WeekService = require('../services/weeks.js');
dotenv.config();

const sendTokenResponse = (user, statusCode, message, req, res) => {
  user.password = undefined;
  const token = authService.getToken(user);
  res.status(statusCode).json({
    status: 'success',
    data: {
      result: user,
      token: token,
    },
    message: message,
  });
};

exports.signin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  // check if email and password exist
  if (!username || !password) {
    return next(new AppError('Please provide username or password', 400));
  }
  // check if user exists and password is correct
  const user = await User.findOne({ username }).select('+password').exec();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 401));
  }
  // send token
  sendTokenResponse(user, 200, 'Successfully signed in!', req, res);
});

exports.register = catchAsync(async (req, res, next) => {
  const { username, email, password, firstName, lastName } = req.body;
  // check if email or username already exist
  const oldUser = await User.findOne({
    $or: [{ username }, { email }],
  }).exec();
  if (oldUser) return next(new AppError('User already exists', 400));
  // save user
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });
  // assign an initial current week
  const newWeek = await WeekService.createWeek(
    { weekName: 'Sample Week', weekDiet: 'Vegan', caloGoal: 2500 },
    user._id
  );
  user.currentWeek = newWeek._id;
  user.avatar = `https://avatars.dicebear.com/api/miniavs/${user._id}.svg`;
  await user.save();
  sendTokenResponse(user, 200, 'Successfully signed up', req, res);
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, password, confirmPassword } = req.body;
  // check if password match
  if (password !== confirmPassword) {
    return new AppError("Password doesn't match", 400);
  }
  // check if old password is correct
  const user = await User.findById(req.userId).select('+password');
  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return next(new AppError('Invalid old password', 401));
  }
  // update password
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  await user.save();
  sendTokenResponse(user, 200, 'Successfully changed password', req, res);
});
