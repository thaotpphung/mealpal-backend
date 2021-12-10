const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth');
const middlewares = require('../middlewares/auth');

router.post('/signin', authController.signin);
router.post('/register', authController.register);
router.patch('/password', middlewares.auth, authController.updatePassword);

router.post('/email/confirm', middlewares.auth, authController.confirmEmail);
router.get('/email/confirm/:token', authController.resetEmail);
router.post('/password/reset', authController.forgotPassword);
router.patch('/password/reset/:token', authController.resetPassword);

module.exports = router;
