"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/recipeRoutes.ts
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const recipeController_1 = require("../controllers/recipeController");
const router = (0, express_1.Router)();
// Public: Fetch all recipes, or if ?mine=true, user's own recipes (must be authenticated for mine=true)
router.get('/', recipeController_1.getAllRecipes);
// Public: Fetch a single recipe by ID
router.get('/:id', recipeController_1.getRecipeById);
// Auth required: Create a new recipe
router.post('/', auth_1.auth, recipeController_1.createRecipe);
// Auth required: Update a recipe if the user is the owner
router.put('/:id', auth_1.auth, recipeController_1.updateRecipe);
// Auth required: Delete a recipe if the user is the owner
router.delete('/:id', auth_1.auth, recipeController_1.deleteRecipe);
exports.default = router;
