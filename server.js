import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import express from 'express'
import userRoutes from './routes/userRoutes.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 5000
const mongoUrl = process.env.MONGO_URL

app.use(bodyParser.json())

mongoose.connect(mongoUrl).then(() => {
    console.log("Database connected successfully.")
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}).catch((error) => console.log(error))

app.use("/api/user", userRoutes)