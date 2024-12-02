import Chapter from '../model/chapterModel.js'
import AuthToken from '../model/authTokenModel.js'
import Book from '../model/bookModel.js'

export const create = async (req, res) => {
    try {
        const { book, cover, title, content, status } = req.body

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

        const chapters = await Chapter.find({ book: bookExist._id })
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