import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import 'dotenv/config'
import { database } from "./database/mongodb.js";
import { Blogs } from "./models/blogs.js";
import { Comments } from "./models/comments.js";
import { Wishlists } from "./models/wishlists.js"
import jwt, { decode } from 'jsonwebtoken';


const app = express();
const PORT = process.env.PORT || 5000;

database();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://texttify.netlify.app'
    ],
    credentials: true,
}));
app.use(cookieParser());


const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;
    console.log(token)
    if (!token) {
        return res
            .status(401)
            .send({
                message: "Unauthorized"
            })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .send({
                    message: "Unauthorized"
                })
        }
        console.log('value in the token', decoded);
        req.user = decoded;
        next();
    })
}

// Testing Working Or Not
app.get('/', (req, res) => {
    res.send("Hello Textify Programmer");
})


// Authentication Related API
app.post('/jwt', async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })
        .send({ success: true, data: token });
    // res.send("shirajul");
})
app.post('/logout', async (req, res) => {
    const user = req.body;
    console.log('logging out', user);
    res.clearCookie('token', { maxAge: 0, sameSite: 'none', secure: true }).send({ success: true })
})


// Blogs 
app.get('/blogs', async (req, res) => {  // Fetch Blogs Data From Database
    const urlQuery = req.query?.category;
    let blogs;
    if (urlQuery !== undefined) {
        console.log(urlQuery);
        blogs = await Blogs.find({ category: urlQuery });
    } else {
        blogs = await Blogs.find();
    }
    res.send(blogs);
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
app.get('/blogs/search', async (req, res) => {
    const searchText = req.query.title
    try {
        const data = await Blogs.find({
            $text: {
                $search: searchText,
                $caseSensitive: false,
            }
        });
        console.log(data);
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error searching blogs", error });
    }
})
app.get('/blog/:id', verifyToken, async (req, res) => {
    // if (req.user.email !== req.query.email) {
    //     console.log(req.ueser.email, " ", req.query.email );
    //     return res.status(403).send({ message: 'forbidden access', u: req.user.email, u1: req.query.email })
    // }
    const blogId = req.params.id;
    const blog = await Blogs.findById(blogId);
    // console.log(blog);
    res.send(blog);
})

app.get('/blogs/featured', async (req, res) => {
    const result = await Blogs.find({});
    const sortedArray = result.sort((a, b) => b.long_description.length - a.long_description.length);
    res.send(sortedArray);
})

/*  ***   Wishlist    ***   */

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
    const query = { blog_id: id };
    const result = await Wishlists.deleteOne(query);
    res.send(result);
})

/*  ***   Comments    ***   */
app.get('/comments/:id', async (req, res) => {

    const id = req.params.id;
    const result = await Comments.find({ blog_id: id });
    // console.log("--- --- ---");
    // console.log("Comments");
    // console.log(result);
    // console.log("Post Comment : ", result);
    console.log(id);
    res.send(result);
})

app.post('/comment', async (req, res) => {
    console.log("Here");
    const insertComment = req.body;
    const result = await Comments.create(insertComment);
    res.send(result);
    console.log(insertComment);
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})