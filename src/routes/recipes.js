import express from 'express';

import {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  updateRecipe,
} from '../controllers/recipes.js';

const router = express.Router();
import auth from '../middleware/auth.js';

router.get('', auth, getAllRecipes);
router.post('/', auth, createRecipe);
router.delete('/:id', auth, deleteRecipe);
router.patch('/:id', auth, updateRecipe);

export default router;
