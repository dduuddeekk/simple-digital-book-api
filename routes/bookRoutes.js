import express from 'express'
import { create, deleteMyBooks, listBooks, myBooks, readOne } from '../controller/bookController.js'

const route = express.Router()

// Book
route.get("/", listBooks)
route.post("/create", create)
route.get("/:id", readOne)
route.post("/author", myBooks)
route.delete("/delete/:id", deleteMyBooks)

export default route