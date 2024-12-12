"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipe = exports.updateRecipe = exports.createRecipe = exports.getRecipeById = exports.getAllRecipes = void 0;
const Recipe_1 = require("../models/Recipe");
const getAllRecipes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // If `mine=true` is in query and user is authenticated, filter by owner's recipes
        if (req.query.mine === 'true') {
            if (!req.user) {
                res.status(401).json({ error: 'You must be logged in to view your own recipes.' });
                return;
            }
            const userRecipes = yield Recipe_1.Recipe.find({ owner: req.user.userId });
            res.json(userRecipes);
            return;
        }
        // Otherwise, return all recipes
        const allRecipes = yield Recipe_1.Recipe.find({});
        res.json(allRecipes);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllRecipes = getAllRecipes;
const getRecipeById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const recipe = yield Recipe_1.Recipe.findById(id);
        if (!recipe) {
            res.status(404).json({ error: 'Recipe not found.' });
            return;
        }
        res.json(recipe);
    }
    catch (error) {
        next(error);
    }
});
exports.getRecipeById = getRecipeById;
const createRecipe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newRecipe = new Recipe_1.Recipe({
            owner: req.user.userId,
            title,
            ingredients,
            steps,
            category,
            imageURL,
        });
        const savedRecipe = yield newRecipe.save();
        res.status(201).json(savedRecipe);
    }
    catch (error) {
        next(error); // Pass errors to the Express error handler
    }
});
exports.createRecipe = createRecipe;
const updateRecipe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized. You must be logged in to update a recipe.' });
            return;
        }
        const { id } = req.params;
        const { title, ingredients, steps, category, imageURL } = req.body;
        const recipe = yield Recipe_1.Recipe.findById(id);
        if (!recipe) {
            res.status(404).json({ error: 'Recipe not found.' });
            return;
        }
        if (recipe.owner.toString() !== req.user.userId) {
            res.status(403).json({ error: 'You are not the owner of this recipe.' });
            return;
        }
        // Update fields if provided
        if (title)
            recipe.title = title;
        if (ingredients)
            recipe.ingredients = ingredients;
        if (steps)
            recipe.steps = steps;
        if (category)
            recipe.category = category;
        if (imageURL !== undefined)
            recipe.imageURL = imageURL;
        const updatedRecipe = yield recipe.save();
        res.json(updatedRecipe);
    }
    catch (error) {
        next(error);
    }
});
exports.updateRecipe = updateRecipe;
const deleteRecipe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized. You must be logged in to delete a recipe.' });
            return;
        }
        const { id } = req.params;
        const recipe = yield Recipe_1.Recipe.findById(id);
        if (!recipe) {
            res.status(404).json({ error: 'Recipe not found.' });
            return;
        }
        if (recipe.owner.toString() !== req.user.userId) {
            res.status(403).json({ error: 'You are not the owner of this recipe.' });
            return;
        }
        yield recipe.deleteOne();
        res.json({ message: 'Recipe deleted successfully.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteRecipe = deleteRecipe;
