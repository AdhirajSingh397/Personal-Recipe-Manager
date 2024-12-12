"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware to parse JSON
app.use(express_1.default.json());
// Use routes
app.use("/api/users", userRoutes_1.default);
const MONGO_URI = process.env.MONGO_URI || "your-default-mongodb-uri";
// Connect to MongoDB
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
