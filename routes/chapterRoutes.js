import express from 'express'
import { create, findChaptersByBook } from '../controller/chapterController.js'

const route = express.Router()

route.post("/create", create)
route.get("/book=:id", findChaptersByBook)

export default route