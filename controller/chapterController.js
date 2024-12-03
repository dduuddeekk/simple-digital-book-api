import Chapter from '../model/chapterModel.js';
import AuthToken from '../model/authTokenModel.js';
import Book from '../model/bookModel.js';
import User from '../model/userModel.js';

/**
 * Create a new chapter for a book
 */
export const create = async (req, res) => {
    try {
        const { book, order, cover, title, content, status } = req.body;

        // Check if the user is authenticated
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        // Extract and validate token
        const token = authHeader.split(' ')[1];
        const tokenExist = await AuthToken.findOne({ token });
        if (!tokenExist) {
            return res.status(404).json({
                error: true,
                message: "Session already ended."
            });
        }

        // Verify the existence of the book
        const findBook = await Book.findOne({ _id: book });
        if (!findBook) {
            return res.status(404).json({
                error: false,
                message: "Book not found."
            });
        }

        // Create a new chapter
        const chapter = new Chapter({
            book,
            order,
            cover,
            title,
            content,
            status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        const savedChapter = await chapter.save();

        res.status(201).json({
            error: false,
            message: "Chapter created!",
            data: savedChapter
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

/**
 * Retrieve all chapters of a specific book
 */
export const findChaptersByBook = async (req, res) => {
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

        // Retrieve all chapters of the book, sorted by order
        const chapters = await Chapter.find({ book: bookExist._id }).sort({ order: 1 });
        if (!chapters) {
            return res.status(200).json({
                error: false,
                message: "This book has no chapters yet.",
                data: null
            });
        }

        return res.status(201).json({
            error: false,
            message: "Chapters retrieved successfully!",
            data: chapters
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

/**
 * Update a chapter for a specific book
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

        // Extract and validate token
        const token = authHeader.split(' ')[1];
        const tokenExist = await AuthToken.findOne({ token });
        if (!tokenExist) {
            return res.status(404).json({
                error: true,
                message: "Session already ended."
            });
        }

        // Retrieve user details
        const user = await User.findOne({ _id: tokenExist.userId });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found."
            });
        }
        const userId = user._id;

        // Retrieve and check if the chapter exists
        const id = req.params.id;
        const chapter = await Chapter.findOne({ _id: id });
        if (!chapter) {
            return res.status(404).json({
                error: true,
                message: "Chapter not found."
            });
        }

        // Check if the user is the author of the book
        const bookId = chapter.book;
        const book = await Book.findOne({ _id: bookId, author: userId });
        if (!book) {
            return res.status(404).json({
                error: true,
                message: "Book not found."
            });
        }

        // Update the chapter
        const updatedChapter = await Chapter.findOneAndUpdate(
            { _id: chapter.id },
            req.body,
            { new: true }
        );
        if (!updatedChapter) {
            return res.status(400).json({
                error: true,
                message: "Failed to update chapter."
            });
        }

        res.status(200).json({
            error: false,
            message: "Chapter updated successfully.",
            data: updatedChapter
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

/**
 * Delete a chapter of a book
 */
export const deleteChapter = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if the user is authenticated
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                message: "User not logged in."
            });
        }

        // Extract and validate token
        const token = authHeader.split(' ')[1];
        const tokenExist = await AuthToken.findOne({ token });
        if (!tokenExist) {
            return res.status(404).json({
                error: true,
                message: "Session already ended."
            });
        }

        // Retrieve user details
        const user = await User.findOne({ _id: tokenExist.userId });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found."
            });
        }
        const userId = user._id;

        // Retrieve and check if the chapter exists
        const id = req.params.id;
        const chapter = await Chapter.findOne({ _id: id });
        if (!chapter) {
            return res.status(404).json({
                error: true,
                message: "Chapter not found."
            });
        }

        // Check if the user is the author of the book
        const bookId = chapter.book;
        const book = await Book.findOne({ _id: bookId, author: userId });
        if (!book) {
            return res.status(404).json({
                error: true,
                message: "Book not found."
            });
        }

        // Delete the chapter
        const deletedChapter = await Chapter.findOneAndDelete({ _id: id });
        if (!deletedChapter) {
            return res.status(400).json({
                error: true,
                message: "Failed to delete chapter."
            });
        }

        res.status(200).json({
            error: false,
            message: "Chapter deleted successfully.",
            data: deletedChapter
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message || "Internal Server Error"
        });
    }
};
