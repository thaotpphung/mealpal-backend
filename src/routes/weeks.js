const express = require('express');

const router = express.Router();
const weekController = require('../controllers/weeks.js');
const middlewares = require('../middlewares/auth.js');

router.get('', middlewares.auth, weekController.getAllWeeks);
router.post('/', middlewares.auth, weekController.createWeek);
router.delete('/:id', middlewares.auth, weekController.deleteWeek);
router.patch('/:id', middlewares.auth, weekController.updateWeek);

module.exports = router;
