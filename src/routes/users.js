const express = require('express');

const router = express.Router();
const authController = require('../controllers/users.js');
const middlewares = require('../middlewares/auth.js');

router.post('/signin', authController.signin);
router.post('/register', authController.register);
router.patch('/:id', middlewares.auth, authController.updateUser);

module.exports = router;
