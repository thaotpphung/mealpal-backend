import express from 'express';

import {
  getPlanListByUserId,
  getPlan,
  createPlan,
  deletePlan,
} from '../controllers/plans.js';

const router = express.Router();
import auth from '../middleware/auth.js';

router.post('/', auth, createPlan);
router.get('/', auth, getPlanListByUserId);
router.get('/:id', auth, getPlan);
router.delete('/:id', auth, deletePlan);

export default router;
