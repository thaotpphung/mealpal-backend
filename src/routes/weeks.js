import express from 'express';

import { getWeeksByPlanId, createWeek } from '../controllers/weeks.js';

const router = express.Router();
import auth from "../middleware/auth.js";

router.get('/:planId', auth, getWeeksByPlanId);
router.post('/', auth, createWeek)

export default router;