import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000; // Set port from .env or default to 5000
const mongoUrl = process.env.MONGO_URL; // MongoDB connection string from .env

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUrl)
    .then(() => {
        console.log("Database connected successfully.");
        // Start the server after successful database connection
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => console.log("Error connecting to the database: ", error));

// Use the routes for user, book, and chapter functionalities
app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/chapter", chapterRoutes);