import express from 'express'
import { create, deleteMyBooks, listBooks, myBooks, readOne, update } from '../controller/bookController.js'

const route = express.Router()

// Book
route.get("/", listBooks)
route.post("/create", create)
route.get("/:id", readOne)
route.post("/author", myBooks)
route.delete("/delete/:id", deleteMyBooks)
route.put("/update/:id", update)

export default route