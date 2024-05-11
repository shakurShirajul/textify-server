import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import 'dotenv/config'
import { database } from "./database/mongodb.js";
import { Blogs } from "./models/blogs.js";
import { Comments } from "./models/comments.js";
import { Wishlists } from "./models/wishlists.js"
import { ObjectId } from "mongodb";


const app = express();
const PORT = process.env.PORT || 5000;

database();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Blogs 
app.get('/blogs', async (req, res) => {  // Fetch Blogs Data From Database
    const data = await Blogs.find({});
    res.send(data);
})
app.get('/blogs/recent', async (req, res) => { // Fetch Recents Six Blog From Database

    const options = { title: 1, image: 1, short_description: 1, category: 1, author_image: 1, author_name: 1, created_at: 1 }
    const data = await Blogs.find({}, options).limit(6).sort({ created_at: -1 });
    res.send(data);
})
app.post('/blog/add', async (req, res) => { // Insert Blog Data Into Database
    const insertBlog = await Blogs.create(req.body);
    res
        .status(201)
        .send({ success: true });
})

// Wishlist
app.get('/wishlists', async (req, res) => {
    const urlQuery = req.query;
    // console.log(urlQuery);
    const query = { user_email: urlQuery.email };
    const options = { blog_id: 1 };
    const data = await Wishlists.find(query, options);

    //  Getting All Wishlist Blog Ids
    const blogIds = data.map(item => item.blog_id);

    const blogQuerys = { _id: { $in: blogIds } };
    // console.log(blogQuerys);

    // Getting All Wishlist Blogs
    const wishlistBlogs = await Blogs.find(blogQuerys);

    // console.log("Wishlist Data: ", wishlistBlogs);
    res.send(wishlistBlogs);
})

app.post('/wishlist', async (req, res) => {
    const insertWishlist = req.body;
    const result = await Wishlists.find(insertWishlist);
    if (result.length === 0) {
        const data = await Wishlists.create(insertWishlist)
        return res
            .status(201)
            .send({ success: true });
    } else {
        return res
            .status(208)
            .send({ message: 'Already Exist' });
    }
})

app.delete('/wishlist/:id', async (req, res) => {
    const id = req.params.id;
    // console.log(id);
    const query = { blog_id: id };
    const result = await Wishlists.deleteOne(query);
    console.log(result);
    res.send(result);
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})