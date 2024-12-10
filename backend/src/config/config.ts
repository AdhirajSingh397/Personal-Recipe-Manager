import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipes';
export const PORT = process.env.PORT || 3000;
