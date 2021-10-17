const express = require('express');

const router = express.Router();
const dayController = require('../controllers/days.js');
const middlewares = require('../middlewares/auth.js');

router.get(
  '/weeks/:weekId',
  middlewares.auth,
  dayController.getDayListByWeekId
);
router.get('/:dayId', middlewares.auth, dayController.getDay);

module.exports = router;
