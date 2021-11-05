const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/users');
const middlewares = require('../middlewares/auth');
const recipeRouter = require('./recipes');
const weekRouter = require('./weeks');

router.use('/:userId/weeks', weekRouter);
router.use('/:userId/recipes', recipeRouter);
router.post('/signin', authController.signin);
router.post('/register', authController.register);
router.patch(
  '/changepassword',
  middlewares.auth,
  authController.changePassword
);
router.patch('/:userId', middlewares.auth, userController.updateUser);
router.get('/:userId', userController.getUser);

module.exports = router;
