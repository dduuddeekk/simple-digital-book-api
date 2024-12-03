import Book from '../model/bookModel.js';
import AuthToken from '../model/authTokenModel.js';
import User from '../model/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Create a new book
 */
export const create = async (req, res) => {
    try {
        const { title, cover, description } = req.body;

        // Check if the user is authenticated
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        // Extract token and verify its existence
        const token = authHeader.split(' ')[1];
        const tokenExist = await AuthToken.findOne({ token });
        if (!tokenExist) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        // Create a new book with the provided details
        const author = tokenExist.userId;
        const book = new Book({
            author,
            title,
            cover,
            description,
            status: "ongoing",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        const savedBook = await book.save();

        res.status(201).json({
            error: false,
            message: "Book created!",
            data: savedBook
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

/**
 * Retrieve a single book by its ID
 */
export const readOne = async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the book exists
        const bookExist = await Book.findOne({ _id: id });
        if (!bookExist) {
            return res.status(404).json({
                error: true,
                message: "Book not found."
            });
        }

        res.status(200).json({
            error: false,
            message: "Book found.",
            data: bookExist
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

/**
 * Retrieve all books
 */
export const listBooks = async (req, res) => {
    try {
        // Retrieve all books
        const books = await Book.find();
        if (books.length === 0) {
            return res.status(404).json({
                error: true,
                message: "Book not found."
            });
        }

        res.status(200).json({
            error: false,
            message: "Books retrieved successfully.",
            data: books
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

/**
 * Retrieve books created by the authenticated user
 */
export const myBooks = async (req, res) => {
    try {
        // Check if the user is authenticated
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        // Verify token
        const token = authHeader.split(' ')[1];
        const tokenExist = await AuthToken.findOne({ token });
        if (!tokenExist) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        // Retrieve books authored by the user
        const userId = tokenExist.userId;
        const books = await Book.find({ author: userId });
        if (books.length === 0) {
            return res.status(404).json({
                error: true,
                message: "No books found for this user."
            });
        }

        res.status(200).json({
            error: false,
            message: "Books retrieved successfully.",
            data: books
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

/**
 * Update a book authored by the authenticated user
 */
export const update = async (req, res) => {
    try {
        // Check if the user is authenticated
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        // Verify token
        const token = authHeader.split(' ')[1];
        const tokenExist = await AuthToken.findOne({ token });
        if (!tokenExist) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        // Check if the user exists
        const userId = tokenExist.userId;
        const author = await User.findOne({ _id: userId });
        if (!author) {
            return res.status(404).json({
                error: true,
                message: "User not found."
            });
        }

        // Update the book
        const id = req.params.id;
        const bookUpdate = await Book.findOneAndUpdate(
            { _id: id, author: author._id },
            req.body,
            { new: true }
        );

        if (!bookUpdate) {
            return res.status(404).json({
                error: true,
                message: "Book not found."
            });
        }

        res.status(200).json({
            error: false,
            message: "Book updated successfully.",
            data: bookUpdate
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

/**
 * Delete a book authored by the authenticated user
 */
export const deleteMyBooks = async (req, res) => {
    try {
        // Check if the user is authenticated
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        // Verify token
        const token = authHeader.split(' ')[1];
        const tokenExist = await AuthToken.findOne({ token });
        if (!tokenExist) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        // Check if the user exists
        const userId = tokenExist.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found."
            });
        }

        // Check if the book exists and delete it
        const id = req.params.id;
        const bookExist = await Book.findOne({ _id: id, author: userId });
        if (!bookExist) {
            return res.status(404).json({
                error: true,
                message: "Book not found."
            });
        }

        await Book.findByIdAndDelete(id);

        res.status(200).json({
            error: false,
            message: "Book deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};
