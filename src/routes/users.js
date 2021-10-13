import express from 'express';
const router = express.Router();
import {
  signin,
  register,
  setCurrentWeek,
  getUser,
} from '../controllers/users.js';
import auth from '../middleware/auth.js';

router.get('/', auth, getUser);
router.post('/signin', signin);
router.post('/register', register);
router.patch('/currentweek', auth, setCurrentWeek);

export default router;
