import express from 'express';

import {
  getAllWeeks,
  createWeek,
  deleteWeek,
  updateWeek,
} from '../controllers/weeks.js';

const router = express.Router();
import auth from '../middleware/auth.js';

router.get('', auth, getAllWeeks);
router.post('/', auth, createWeek);
router.delete('/:id', auth, deleteWeek);
router.patch('/:id', auth, updateWeek);

export default router;
