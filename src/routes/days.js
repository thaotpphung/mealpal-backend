import express from 'express';

import { getDayListByWeekId } from '../controllers/days.js';

const router = express.Router();
import auth from '../middleware/auth.js';

router.get('/:weekId', auth, getDayListByWeekId);

export default router;
