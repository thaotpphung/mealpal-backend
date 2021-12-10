const express = require('express');

const router = express.Router();
const userController = require('../controllers/users');
const middlewares = require('../middlewares/auth');
const recipeRouter = require('./recipes');
const weekRouter = require('./weeks');

router.use('/:userId/weeks', weekRouter);
router.use('/:userId/recipes', recipeRouter);
router.patch('/:userId', middlewares.auth, userController.updateUser);
router.get('/:userId', userController.getUser);
router.post('/:userId/cart', userController.sendCart);

module.exports = router;
