const Week = require('../models/weeks.js');
const log = require('npmlog');

createInitialDays = async () => {
  const meals = ['Breakfast', 'Lunch', 'Dinner'];
  let initialMeals = [];
  meals.forEach((meal, idx) => {
    initialMeals.push({
      name: meal,
      order: idx,
      recipes: [],
      food: [],
      calories: 0,
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
      name: day,
      meals: initialMeals,
      calories: 0,
    });
  });
  return initialDays;
};

exports.createWeek = async (week, userId) => {
  const newWeek = await Week.create({ ...week, userId });
  const days = await createInitialDays();
  newWeek.days = days;
  await newWeek.save();
  const populatedWeek = await Week.findById(newWeek._id).populate({
    path: 'userId',
    model: 'User',
    select: ['avatar', 'username'],
  });
  return populatedWeek;
};
