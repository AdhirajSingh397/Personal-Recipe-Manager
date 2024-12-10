import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  { JWT_SECRET }  from "../config/config";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Please provide all fields." });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ error: "User with this email or username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    next(error); // Pass errors to Express error handler
  }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        res.status(400).json({ error: "Invalid Fields" });
        return;
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ error: "User does not exist" });
        return;
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials." });
        return;
      }
  
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
  
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      next(error); // Pass errors to Express error handler
    }
  };
  