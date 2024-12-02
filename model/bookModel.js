import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
    author:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    cover:{
        type:String,
        required:false
    },
    description:{
        type:String,
        required:false
    },
    status:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        required:true
    },
    updatedAt:{
        type:String,
        required:true
    }
})

export default mongoose.model("books", bookSchema)