import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_name : {
        type : String,
        required: true,
    },
    user_email : {
        type: String,
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

export const Users = mongoose.model("users", userSchema)