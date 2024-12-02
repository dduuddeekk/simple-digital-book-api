import express from 'express'
import { create, listBooks, myBooks, readOne } from '../controller/bookController.js'

const route = express.Router()

// Book
route.get("/", listBooks)
route.post("/create", create)
route.get("/:id", readOne)
route.post("/author", myBooks)

export default route