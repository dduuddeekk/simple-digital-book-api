import mongoose, { trusted } from "mongoose"

const chapterSchema = new mongoose.Schema({
    book:{
        type:String,
        required:true
    },
    order:{
        type:Number,
        required:true
    },
    cover:{
        type:String,
        reuqired:false
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:false
    },
    status:{
        type:String,
        reuqired:true
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

export default mongoose.model("chapters", chapterSchema)