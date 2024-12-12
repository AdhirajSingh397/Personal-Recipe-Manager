// src/controllers/recipeController.ts
import { Request, Response, NextFunction } from 'express';
import { Recipe } from '../models/Recipe';

export const getAllRecipes = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    // If `mine=true` is in query and user is authenticated, filter by owner's recipes
    if (req.query.mine === 'true') {
      if (!req.user) {
        res.status(401).json({ error: 'You must be logged in to view your own recipes.' });
        return 
      }
      const userRecipes = await Recipe.find({ owner: req.user.userId });
      res.json(userRecipes);
      return 
    }

    // Otherwise, return all recipes
    const allRecipes = await Recipe.find({});
    res.json(allRecipes);
  } catch (error) {
    next(error);
  }
};

export const getRecipeById = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
     res.status(404).json({ error: 'Recipe not found.' });
     return
    }
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

export const createRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized. You must be logged in to create a recipe.' });
        return; // Explicitly return
      }
  
      const { title, ingredients, steps, category, imageURL } = req.body;
      if (!title || !ingredients || !steps || !category) {
        res.status(400).json({ error: 'Missing required fields: title, ingredients, steps, category.' });
        return; // Explicitly return
      }
  
      const newRecipe = new Recipe({
        owner: req.user.userId,
        title,
        ingredients,
        steps,
        category,
        imageURL,
      });
  
      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);
    } catch (error) {
      next(error); // Pass errors to the Express error handler
    }
  };
  

export const updateRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
       res.status(401).json({ error: 'Unauthorized. You must be logged in to update a recipe.' });
       return
    }

    const { id } = req.params;
    const { title, ingredients, steps, category, imageURL } = req.body;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
       res.status(404).json({ error: 'Recipe not found.' });
       return
    }

    if (recipe.owner.toString() !== req.user.userId) {
       res.status(403).json({ error: 'You are not the owner of this recipe.' });
       return
    }

    // Update fields if provided
    if (title) recipe.title = title;
    if (ingredients) recipe.ingredients = ingredients;
    if (steps) recipe.steps = steps;
    if (category) recipe.category = category;
    if (imageURL !== undefined) recipe.imageURL = imageURL;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
       res.status(401).json({ error: 'Unauthorized. You must be logged in to delete a recipe.' });
       return
    }

    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found.' });
      return
    }

    if (recipe.owner.toString() !== req.user.userId) {
      res.status(403).json({ error: 'You are not the owner of this recipe.' });
      return 
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
