const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/users.js');
const authUtils = require('../utils/authUtils.js');

dotenv.config();

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .populate('currentPlan')
      .populate('currentWeek')
      .exec();
    if (!user) {
      console.log("user doesn't exists");
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ result: user, token: authUtils.getToken(user) });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const oldUser = await User.findOne({ email })
      .populate('currentPlan')
      .populate('currentWeek')
      .exec();
    if (oldUser)
      return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      fullName: `${firstName} ${lastName}`,
    });
    res.status(201).json({ result, token: authUtils.getToken(result) });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.log(error);
  }
};

exports.setCurrentWeek = async (req, res) => {
  const { weekId } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      $set: { currentWeek: weekId },
    },
    { new: true }
  )
    .populate('currentWeek')
    .exec();

  res.status(200).json({ user });
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.userId);
  res.status(200).json({ user });
};
