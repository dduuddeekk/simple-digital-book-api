import mongoose from 'mongoose'

const authTokenSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        required:true
    },
    expiredAt:{
        type:String,
        required:true
    }
})

export default mongoose.model("auth_tokens", authTokenSchema)