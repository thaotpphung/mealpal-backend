import express from 'express';

import { getDayListByWeekId, updateDay } from '../controllers/days.js';

const router = express.Router();
import auth from '../middleware/auth.js';

router.get('/:weekId', auth, getDayListByWeekId);
router.put('/:dayId', auth, updateDay);

export default router;
