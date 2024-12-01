import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    passwordHash:{
        type:String,
        required:true
    },
    birthdate:{
        type:String,
        required:false
    },
    gender:{
        type:String,
        required:false
    },
    biography:{
        type:String,
        required:false
    },
    role:{
        type:String,
        required:true
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

export default mongoose.model("users", userSchema)