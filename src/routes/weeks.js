const express = require('express');

const router = express.Router({ mergeParams: true });
const weekController = require('../controllers/weeks.js');
const middlewares = require('../middlewares/auth.js');

router.get('/', weekController.getAllWeeks);
router.get('/:id', weekController.getWeek);
router.post('/', middlewares.auth, weekController.createWeek);
router.delete('/:id', middlewares.auth, weekController.deleteWeek);
router.patch('/:id', middlewares.auth, weekController.updateWeek);
router.patch(
  '/:id/days/:dayIdx',
  middlewares.auth,
  weekController.updateWeekByDay
);

module.exports = router;
