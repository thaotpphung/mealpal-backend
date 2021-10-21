const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/users.js');
const Week = require('../models/weeks.js');

const authUtils = require('../utils/authUtils.js');

dotenv.config();

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate('currentWeek').exec();
    if (!user) {
      console.log("user doesn't exists");
      return res.status(404).json({ message: "User doesn't exist" });
    }
    console.log(email, password);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log('password invalid');

      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('done check password');
    res.status(200).json({
      status: 'success',
      data: { result: user, token: authUtils.getToken(user) },
      message: 'Successfully logged in',
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const oldUser = await User.findOne({ email }).exec();
    if (oldUser)
      return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    const newWeek = await Week.create({ weekName: 'Sample Week' });
    const days = await createInitialDays();
    newWeek.days = days;
    await newWeek.save();
    result.currentWeek = newWeek._id;
    await result.save();
    res.status(201).json({
      status: 'success',
      data: { result, token: authUtils.getToken(result) },
      message: 'Successfully signed up',
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.log('error register', error);
  }
};

const createInitialDays = async () => {
  const meals = ['Break Fast', 'Lunch', 'Dinner'];
  let initialMeals = [];
  meals.forEach((meal, idx) => {
    initialMeals.push({
      mealName: meal,
      order: idx,
      food: [],
    });
  });
  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  let initialDays = [];
  weekDays.forEach((day) => {
    initialDays.push({
      dayName: day,
      meals: initialMeals,
    });
  });
  return initialDays;
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
      message: 'Successfully updated user',
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.log('error register', error);
  }
};
