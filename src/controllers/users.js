const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/users.js');
const Day = require('../models/days.js');
const Week = require('../models/weeks.js');
const Meal = require('../models/weeks.js');

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

    const newWeek = await Week.create({
      weekName: 'Sample Week',
      userId: result._id,
      weekDescription: 'Sample Description',
      weekDiet: 'Vegan',
      weekTags: ['Add', 'Tags', 'To', 'Your', 'Week'],
    });
    const newNewWeek = await Week.findById(newWeek._id);
    await createInitialDays(newWeek._id);
    result.currentWeek = newWeek;
    await result.save();
    const newUser = await User.findById(result._id).populate('currentWeek');

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

exports.setCurrentWeek = async (req, res) => {
  try {
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

    res.status(200).json({
      status: 'success',
      data: user,
      message: 'Successfully set current week',
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.log('error set current week', weekId, error);
  }
};

const createInitialDays = async (weekId) => {
  const weekDays = [
    'Monday',
    'Tuesday',
    'WednesDay',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const initalMeals = ['Break Fast', 'Lunch', 'Dinner'];
  try {
    weekDays.forEach(async (dayName, dayIdx) => {
      const newDay = new Day({ dayName, weekId, dayOrder: dayIdx + 1 });
      console.log('create day', weekId);
      await newDay.save();
      // try {
      // const meals = await Promise.all(
      //   initalMeals.map(async (mealName) => {
      //     await Meal.create({ mealName, dayId: newDay._id, weekId });
      //   })
      // );
      //   console.log('create meals', meals);
      // } catch (error) {
      //   console.log('error creating meals', error);
      // }
    });
  } catch (error) {
    console.log('error creating day', error);
    res.status(409).json({ message: error.message });
  }
};
