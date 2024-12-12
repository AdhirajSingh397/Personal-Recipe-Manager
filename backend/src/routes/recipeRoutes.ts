// src/routes/recipeRoutes.ts
import { Application, Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController';

const router = Router();

// Public: Fetch all recipes, or if ?mine=true, user's own recipes (must be authenticated for mine=true)
router.get('/', getAllRecipes);

// Public: Fetch a single recipe by ID
router.get('/:id', getRecipeById);

// Auth required: Create a new recipe
router.post('/', auth, createRecipe);

// Auth required: Update a recipe if the user is the owner
router.put('/:id', auth, updateRecipe);

// Auth required: Delete a recipe if the user is the owner
router.delete('/:id', auth, deleteRecipe);

export default router;
