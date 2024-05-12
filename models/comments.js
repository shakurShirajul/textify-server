import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    blog_id: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    commenter_name: {
        type: String,
        required: true,
    },
    commenter_email: {
        type: String,
        required: true,
    },
    commenter_image: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
})

export const Comments = mongoose.model("comments", commentSchema)