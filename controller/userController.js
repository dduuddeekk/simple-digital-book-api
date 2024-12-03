import User from '../model/userModel.js';
import AuthToken from '../model/authTokenModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Register a new user
 */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if the user with the given email already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                error: true,
                message: "User already exists."
            });
        }

        // Generate a unique username
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        const username = `${firstName.toLowerCase()}${randomSuffix}`;

        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create the new user with the necessary fields
        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            passwordHash,
            birthdate: null,
            gender: null,
            biography: null,
            role: "user",
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        res.status(201).json({
            error: false,
            message: "User registered successfully!",
            data: savedUser
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

/**
 * User login and token generation
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists by email
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({
                error: true,
                message: "Invalid e-mail address."
            });
        }
        if (userExist.status === "banned") {
            return res.status(400).json({
                error: true,
                message: "User is banned."
            });
        }

        // Verify the provided password
        const isPasswordValid = await bcrypt.compare(password, userExist.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({
                error: true,
                message: "Invalid password."
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: userExist._id },
            SECRET_KEY,
            { expiresIn: "7d" }
        );

        // Calculate the expiration time of the token
        const currentDateTime = new Date();
        const expirationDateTime = new Date(currentDateTime.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Save the token in the database
        const authToken = new AuthToken({
            userId: userExist._id,
            token,
            createdAt: new Date().toISOString(),
            expiredAt: expirationDateTime.toISOString()
        });
        const savedToken = await authToken.save();

        res.status(201).json({
            error: false,
            message: "Log In successful!",
            data: {
                user: {
                    _id: userExist._id,
                    username: userExist.username
                },
                token: savedToken.token
            }
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

/**
 * Update user information
 */
export const update = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if the user is authenticated
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        // Extract the token from the header
        const token = authHeader.split(' ')[1];
        const tokenExist = await AuthToken.findOne({ token });

        if (!tokenExist) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        const userId = tokenExist.userId;

        // Update the user information
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                error: true,
                message: "User not found."
            });
        }

        res.status(200).json({
            error: false,
            message: "User updated successfully.",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            error: true,
            message: "Internal server error."
        });
    }
};

/**
 * Logout and invalidate the token
 */
export const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if the user is authenticated
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                message: "Authorization header is missing or malformed."
            });
        }

        // Extract the token from the header
        const token = authHeader.split(' ')[1];
        const tokenExist = await AuthToken.findOne({ token });

        if (!tokenExist) {
            return res.status(404).json({
                error: true,
                message: "Session already ended."
            });
        }

        // Delete the token to log out
        await AuthToken.deleteOne({ token });

        res.status(200).json({
            error: false,
            message: "Logout successful."
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};
