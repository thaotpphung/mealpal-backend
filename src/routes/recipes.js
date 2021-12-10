const express = require('express');

const router = express.Router({ mergeParams: true });
const recipeController = require('../controllers/recipes.js');
const middlewares = require('../middlewares/auth.js');

router.get('', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipe);
router.post('/', middlewares.auth, recipeController.createRecipe);
router.post('/deletes', middlewares.auth, recipeController.deleteRecipes);
router.delete('/:id', middlewares.auth, recipeController.deleteRecipe);
router.patch('/:id', middlewares.auth, recipeController.updateRecipe);

module.exports = router;
