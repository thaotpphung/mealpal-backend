const express = require('express');

const router = express.Router();
const planController = require('../controllers/plans.js');
const middlewares = require('../middlewares/auth.js');

router.post('/', middlewares.auth, planController.createPlan);
router.get('/', middlewares.auth, planController.getPlanListByUserId);
router.get('/:id', middlewares.auth, planController.getPlan);
router.delete('/:id', middlewares.auth, planController.deletePlan);

module.exports = router;
