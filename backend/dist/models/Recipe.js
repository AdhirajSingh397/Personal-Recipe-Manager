"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipe = void 0;
// src/models/Recipe.ts
const mongoose_1 = require("mongoose");
const recipeSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    steps: {
        type: [String],
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    imageURL: {
        type: String,
        default: '',
    },
}, { timestamps: true });
exports.Recipe = (0, mongoose_1.model)('Recipe', recipeSchema);
