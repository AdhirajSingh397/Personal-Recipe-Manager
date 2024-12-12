// src/models/Recipe.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IRecipe extends Document {
  owner: Types.ObjectId;
  title: string;
  ingredients: string[];
  steps: string[];
  category: string;
  imageURL?: string;
}

const recipeSchema = new Schema<IRecipe>(
  {
    owner: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

export const Recipe = model<IRecipe>('Recipe', recipeSchema);
