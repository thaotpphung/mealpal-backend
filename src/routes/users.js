const express = require('express');

const router = express.Router();
const authController = require('../controllers/users.js');
const middlewares = require('../middlewares/auth.js');

router.get('/', middlewares.auth, authController.getUser);
router.post('/signin', authController.signin);
router.post('/register', authController.register);
router.patch('/currentweek', middlewares.auth, authController.setCurrentWeek);

module.exports = router;
