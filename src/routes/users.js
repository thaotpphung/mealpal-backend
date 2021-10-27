const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth.js');
const userController = require('../controllers/users.js');
const middlewares = require('../middlewares/auth.js');

router.post('/signin', authController.signin);
router.post('/register', authController.register);
router.patch(
  '/changepassword',
  middlewares.auth,
  authController.changePassword
);
router.patch('/:id', middlewares.auth, userController.updateUser);

module.exports = router;
