import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
    author_name: {
        type: String,
        required: true,
    },
    author_email: {
        type: String,
        required: true,
    }
})

export const Comments = mongoose.model("comments", commentSchema)