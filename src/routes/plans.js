import express from 'express';

import { getPlansByUserId, getPlan, createPlan, updatePlan, deletePlan } from '../controllers/plans.js';

const router = express.Router();
import auth from "../middleware/auth.js";

router.post('/', auth, createPlan);
router.get('/', auth, getPlansByUserId);
router.get('/:id', auth, getPlan);
router.put('/:id', auth, updatePlan);
router.delete('/:id', auth, deletePlan);

export default router;