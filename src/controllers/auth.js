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
    { name: 'Sample Week', calories: 0 },
    user._id
  );
  user.currentWeek = newWeek._id;
  user.avatar = `https://avatars.dicebear.com/api/miniavs/${user._id}.svg`;
  await user.save();
  // send welcome email
  const url = `${req.protocol}://${req.get('host')}/confirmEmail`;
  sendTokenResponse(user, 200, 'Successfully signed up', req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
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
  user.password = undefined;

  sendTokenResponse(user, 200, 'Successfully changed password', req, res);
});

// send confirmation email with token
exports.confirmEmail = catchAsync(async (req, res, next) => {
  // 1) Get user email
  const user = await User.findById(req.userId).select(['email', 'firstName']);

  // 2) Generate the random reset token
  const token = crypto.randomBytes(32).toString('hex');
  user.utilToken = crypto.createHash('sha256').update(token).digest('hex');
  user.utilTokenExpiresIn = Date.now() + 10 * 60 * 1000;
  await user.save();

  // 3) Send it to user's email
  const confirmUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/email/confirm/${token}`;

  const response = await new Email(user).sendConfirmationEmail(confirmUrl);
  if (response === 'success') {
    res.status(200).json({
      data: null,
      status: 'success',
      message:
        'A confirmation code was sent to your email, please check your inbox, including Promotions, Spam, etc folder',
    });
  } else {
    user.utilToken = undefined;
    user.utilTokenExpiresIn = undefined;
    await user.save();
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

// after user send valid confirm token, reset email
exports.resetEmail = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    utilToken: hashedToken,
    utilTokenExpiresIn: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set email user verified
  if (!user) {
    res.status(400).render('error', {
      message: 'Token is invalid or has expired',
    });
  }

  user.utilToken = undefined;
  user.utilTokenExpiresIn = undefined;
  user.isVerified = true;
  await user.save();

  let redirectUrl = config.CLIENT_BASE_URL + `/users/${user._id}/success`;

  res.status(200).render('confirmSuccess', {
    firstName: user.firstName,
    redirectUrl,
  });
});

// send reset password email wtih token
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user email
  const user = await User.findOne({ email: req.body.email }).select([
    'email',
    'firstName',
  ]);

  // 2) Generate the random reset token
  const token = crypto.randomBytes(32).toString('hex');
  user.utilToken = crypto.createHash('sha256').update(token).digest('hex');
  user.utilTokenExpiresIn = Date.now() + 10 * 60 * 1000;
  await user.save();

  // 3) Send it to user's email
  const redirectUrl = `${config.CLIENT_BASE_URL}/password/reset/${token}`;

  const response = await new Email(user).sendResetPasswordEmail(redirectUrl);
  if (response === 'success') {
    res.status(200).json({
      data: null,
      status: 'success',
      message:
        'A link for password reset has been sent to your email, please check your inbox, including Promotions, Spam, etc folder',
    });
  } else {
    user.utilToken = undefined;
    user.utilTokenExpiresIn = undefined;
    await user.save();
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

// after user send validtoken, reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    utilToken: hashedToken,
    utilTokenExpiresIn: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set new password
  if (!user) {
    return next(
      new AppError(
        'Rest token is invalid or has expired, please try again later',
        400
      )
    );
  }

  user.utilToken = undefined;
  user.utilTokenExpiresIn = undefined;
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  await user.save();

  user.password = undefined;
  sendTokenResponse(user, 200, 'Successfully reset password', req, res);
});
