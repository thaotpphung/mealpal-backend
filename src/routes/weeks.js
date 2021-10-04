import express from 'express';

import {
  getWeekListByPlanId,
  createWeek,
  deleteWeek,
} from '../controllers/weeks.js';

const router = express.Router();
import auth from '../middleware/auth.js';

router.get('/:planId', auth, getWeekListByPlanId);
router.post('/', auth, createWeek);
router.delete('/:id', auth, deleteWeek);

export default router;
