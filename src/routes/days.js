const express = require('express');

const router = express.Router();
const dayController = require('../controllers/days.js');
const middlewares = require('../middlewares/auth.js');

router.get('/:weekId', middlewares.auth, dayController.getDayListByWeekId);

module.exports = router;
