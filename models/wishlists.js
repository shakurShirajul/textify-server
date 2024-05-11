import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user_email :{
        type: String,
        require: true,
    },
    blog_id: {
        type: String,
        require: true,
    }
})

export const Wishlists = mongoose.model("wishlists", wishlistSchema);