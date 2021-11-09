const Recipe = require('../models/recipes.js');

exports.createRecipe = async (recipe, userId) => {
  const ingredients = [
    {
      amount: {
        whole: 0,
        numer: 0,
        denom: 1,
      },
      ingredientName: '',
      unit: { label: '' },
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
    select: ['avatar', 'username'],
  });
  return populatedRecipe;
};
