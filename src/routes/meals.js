import express from 'express';

import { createMeal, deleteMeal } from '../controllers/meals.js';

const router = express.Router();
import auth from '../middleware/auth.js';

router.post('/', auth, createMeal);
router.delete('/:id', auth, deleteMeal);

export default router;
