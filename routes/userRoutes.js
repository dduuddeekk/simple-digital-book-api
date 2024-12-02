import express from 'express'
import { register, login, update, logout } from '../controller/userController.js'

const route = express.Router()

// // Testing
// route.get("/", fetch)
// route.post("/create", create)
// route.put("/update/:id", update)
// route.delete("/delete/:id", deleteUser)

// Account
route.post("/register", register)
route.post("/login", login)
route.put("/update", update)
route.delete("/logout", logout)

export default route