const express = require('express');

const router = express.Router();
const mealController = require('../controllers/meals.js');
const middlewares = require('../middlewares/auth.js');

router.post('/', middlewares.auth, mealController.createMeal);
router.delete('/:id', middlewares.auth, mealController.deleteMeal);
router.patch('/:id', middlewares.auth, mealController.updateMeal);

module.exports = router;
