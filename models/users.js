import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user_name : {
        type : String,
        required: true,
    },
    user_image :{
        type: String,
        required: true,
    },
    number_of_blog: {
        type: Number,
        default: 0,
    }
})

export const Comments = mongoose.model("comments", commentSchema)