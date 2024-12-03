import Chapter from '../model/chapterModel.js'
import AuthToken from '../model/authTokenModel.js'
import Book from '../model/bookModel.js'
import User from '../model/userModel.js'
import mongoose from 'mongoose'

export const create = async (req, res) => {
    try {
        const { book, order, cover, title, content, status } = req.body

        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({
            error: true,
            message: "User not logged."
        })

        const token = authHeader.split(' ')[1]
        const tokenExist = await AuthToken.findOne({ token })
        if (!tokenExist) return res.status(404).json({
            error: true,
            message: "Session already ended."
        })

        const findBook = await Book.findOne({ _id: book })
        if (!findBook) return res.status(404).json({
            error: false,
            message: "Book not found."
        })

        const chapter = new Chapter({
            book,
            order,
            cover,
            title,
            content,
            status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })

        const savedChapter = await chapter.save()

        res.status(201).json({
            error: false,
            message: "Chapter created!",
            data: savedChapter
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error
        })
    }
}

export const findChaptersByBook = async (req, res) => {
    try {
        const id = req.params.id
        const bookExist = await Book.findOne({ _id: id })
        if (!bookExist) return res.status(404).json({
            error: true,
            message: "Book not found."
        })

        const chapters = await Chapter.find({ book: bookExist._id }).sort({ order: 1 })
        if (!chapters) return res.status(200).json({
            error: false,
            message: "This book had no chapter(s) yet.",
            data: null
        })

        return res.status(201).json({
            error: false,
            message: "Chapters retrieved successfully!",
            data: chapters
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error
        })
    }
}

export const update = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({
            error: true,
            message: "User not logged."
        })

        const token = authHeader.split(' ')[1]
        const tokenExist = await AuthToken.findOne({ token })
        if (!tokenExist) return res.status(404).json({
            error: true,
            message: "Session already ended."
        })

        const user = await User.findOne({ _id: tokenExist.userId })
        if (!user) return res.status(404).json({
            error: true,
            message: "User not found."
        })
        const userId = user._id

        const id = req.params.id
        const chapter = await Chapter.findOne({ _id: id })
        if (!chapter) res.status(404).json({
            error: true,
            message: "Chapter not found."
        })

        const bookId = chapter.book
        const book = await Book.findOne({ _id: bookId, author: userId })
        if (!book) res.status(404).json({
            error: true,
            message: "Book not found."
        })

        const updatedChapter = await Chapter.findOneAndUpdate({ _id: chapter.id }, req.body, { new: true })
        if (!updatedChapter) res.status(400).json({
            error: true,
            message: "Failed updated chapter."
        })

        res.status(200).json({
            error: false,
            message: "Chapter updated successfully.",
            data: updatedChapter
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error
        })
    }
}

export const deleteChapter = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: true,
                message: "User not logged."
            })
        }

        const token = authHeader.split(' ')[1]
        const tokenExist = await AuthToken.findOne({ token })
        if (!tokenExist) {
            return res.status(404).json({
                error: true,
                message: "Session already ended."
            })
        }

        const user = await User.findOne({ _id: tokenExist.userId })
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found."
            })
        }
        const userId = user._id

        const id = req.params.id
        const chapter = await Chapter.findOne({ _id: id })
        if (!chapter) {
            return res.status(404).json({
                error: true,
                message: "Chapter not found."
            })
        }

        const bookId = chapter.book
        const book = await Book.findOne({ _id: bookId, author: userId })
        if (!book) {
            return res.status(404).json({
                error: true,
                message: "Book not found."
            })
        }

        const deletedChapter = await Chapter.findOneAndDelete({ _id: id })
        if (!deletedChapter) {
            return res.status(400).json({
                error: true,
                message: "Failed to delete chapter."
            })
        }

        return res.status(200).json({
            error: false,
            message: "Chapter deleted successfully.",
            data: deletedChapter
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || "Internal Server Error"
        })
    }
}