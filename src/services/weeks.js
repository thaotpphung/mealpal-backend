const Week = require('../models/weeks.js');

createInitialDays = async () => {
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

exports.createWeek = async (week, userId) => {
  const newWeek = await Week.create({ ...week, userId });
  const days = await createInitialDays();
  newWeek.days = days;
  await newWeek.save();
  const populatedWeek = await Week.findById(newWeek._id).populate({
    path: 'userId',
    model: 'User',
    select: 'avatar',
  });
  return populatedWeek;
};
