import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        requires:true
    },
    email:{
        type:String,
        requires:true
    },
    address:{
        type:String,
        requires:true
    },
})

export default mongoose.model("users", userSchema)