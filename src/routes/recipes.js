const express = require('express');

const router = express.Router();
const recipeController = require('../controllers/recipes.js');
const middlewares = require('../middlewares/auth.js');

router.get('', middlewares.auth, recipeController.getAllRecipes);
router.post('/', middlewares.auth, recipeController.createRecipe);
router.delete('/:id', middlewares.auth, recipeController.deleteRecipe);
router.patch('/:id', middlewares.auth, recipeController.updateRecipe);

module.exports = router;
