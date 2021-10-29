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
  const newWeek = new Week({ ...week, userId: userId });
  const days = await createInitialDays();
  newWeek.days = days;
  await newWeek.save();
  return newWeek;
};
