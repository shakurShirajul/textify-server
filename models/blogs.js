import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    short_description: {
        type: String,
        required: true,
    },
    long_description: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    author_image:{
        type: String,
        required: true,
    },
    author_name:{
        type: String,
        required: true,
    },
    author_email:{
        type: String,
        required: true,
    }
})

export const Blogs = mongoose.model("blogs", blogSchema);