const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/users.js');
const authService = require('../services/auth.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../errors/AppError');
const Email = require('../utils/email');
const WeekService = require('../services/weeks.js');
const config = require('./../../config');
const log = require('npmlog');

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
  if (oldUser)
    return next(new AppError('Username and email must be unique', 400));
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
    { weekName: 'Sample Week', caloGoal: 0, weekDiet: 'normal' },
    user._id
  );
  user.currentWeek = newWeek._id;
  user.avatar = `https://avatars.dicebear.com/api/miniavs/${user._id}.svg`;
  await user.save();
  // send welcome email
  const url = `${req.protocol}://${req.get('host')}/confirmEmail`;
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

// send confirmation token to user's email
exports.sendConfirmationEmail = catchAsync(async (req, res, next) => {
  // 1) Get user email
  const user = await User.findById(req.userId).select(['email', 'firstName']);

  // 2) Generate the random reset token
  const token = crypto.randomBytes(32).toString('hex');
  user.confirmEmailToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  user.confirmEmailTokenExpiresIn = Date.now() + 10 * 60 * 1000;
  await user.save();

  // 3) Send it to user's email
  try {
    const confirmUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/users/email/confirm/${token}`;
    await new Email(user).sendConfirmationEmail(confirmUrl);
    res.status(200).json({
      data: null,
      status: 'success',
      message:
        'A confirmation code was sent to your email, please check your inbox including spam folder',
    });
  } catch (err) {
    user.confirmEmailToken = undefined;
    user.confirmEmailTokenExpiresIn = undefined;
    await user.save();
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

// when user send patch request with token
exports.confirmEmail = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    confirmEmailToken: hashedToken,
    confirmEmailTokenExpiresIn: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set email user verified
  if (!user) {
    res.status(400).render('error', {
      message: 'Token is invalid or has expired',
    });
  }

  user.confirmEmailToken = undefined;
  user.confirmEmailTokenExpiresIn = undefined;
  user.isVerified = true;
  await user.save();

  let redirectUrl = config.CLIENT_BASE_URL + `/users/${user._id}/success`;

  res.status(200).render('confirmSuccess', {
    firstName: user.firstName,
    redirectUrl,
  });
});
