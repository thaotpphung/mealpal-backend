const Recipe = require('../models/recipes.js');

exports.createRecipe = async (recipe, userId) => {
  const ingredients = [
    {
      whole: 0,
      numer: 0,
      denom: 1,
      food: '[Food]',
      unit: { label: 'kg' },
    },
  ];
  const newRecipe = await Recipe.create({
    ...recipe,
    userId,
    ingredients,
  });
  const populatedRecipe = await Recipe.findById(newRecipe._id).populate({
    path: 'userId',
    model: 'User',
    select: 'avatar',
  });
  return populatedRecipe;
};
