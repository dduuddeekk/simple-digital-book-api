import Book from '../model/bookModel.js'
import AuthToken from '../model/authTokenModel.js'
import User from '../model/userModel.js'
import dotenv from 'dotenv'
dotenv.config()

export const create = async (req, res) => {
    try {
        const { title, cover, description } = req.body

        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({
            error: true,
            message: "User not logged in."
        })

        const token = authHeader.split(' ')[1]
        const tokenExist = await AuthToken.findOne({ token })

        if (!tokenExist) return res.status(401).json({
            error: true,
            message: "User not logged in."
        })

        const author = tokenExist.userId

        const book = new Book({
            author: author,
            title,
            cover,
            description,
            status: "ongoing",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })

        const savedBook = await book.save()

        res.status(201).json({
            error: false,
            message: "Book created!",
            data: savedBook
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error
        })
    }
}

export const readOne = async (req, res) => {
    try {
        const id = req.params.id
        const bookExist = await Book.findOne({ _id: id })
        if (!bookExist) return res.status(404).json({
            error: true,
            message: "Book not found."
        })

        res.status(200).json({
            error: false,
            message: "Book found.",
            data: bookExist
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error
        })
    }
}

export const listBooks = async (req, res) => {
    try {
        const books = await Book.find()
        if (books.length === 0) return res.status(404).json({
            error: true,
            message: "Book not found."
        })
        res.status(200).json({
            error: false,
            message: "Books retrieved successfully.",
            data: books
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error
        })
    }
}

export const myBooks = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({
            error: true,
            message: "User not logged in."
        })

        const token = authHeader.split(' ')[1]
        const tokenExist = await AuthToken.findOne({ token })

        if (!tokenExist) return res.status(401).json({
            error: true,
            message: "User not logged in."
        })

        const userId = tokenExist.userId

        const books = await Book.find({ author: userId })

        if (books.length === 0) return res.status(404).json({
            error: true,
            message: "No books found for this user."
        })

        res.status(200).json({
            error: false,
            message: "Books retrieved successfully.",
            data: books
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        })
    }
}

export const deleteMyBooks = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({
            error: true,
            message: "User not logged in."
        })

        const token = authHeader.split(' ')[1]
        const tokenExist = await AuthToken.findOne({ token })

        if (!tokenExist) return res.status(401).json({
            error: true,
            message: "User not logged in."
        })

        const userId = tokenExist.userId
        const user = await User.findOne({ _id: userId })
        if (!user) res.status(404).json({
            error: true,
            message: "User not found."
        })

        const id = req.params.id
        const bookExist = await Book.findOne({ _id: id, author: userId })
        if (!bookExist) return res.status(404).json({
            error: true,
            message: "Book not found."
        })

        await Book.findByIdAndDelete(id)

        res.status(200).json({
            error: false,
            message: "Book deleted successfully."
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        })
    }
}
