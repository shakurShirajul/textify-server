import express from "express";
import { database } from "./database/mongodb.js";
import { Blogs } from "./models/blogs.js";

const app = express();
const PORT = process.env.PORT || 5000;

database();

// Middlewares
app.use(express.json());


// Blogs 

app.get('/blogs', async (req, res) => {  // Fetch Blogs Data From Database
    const data = await Blogs.find({});
    res.send(data);
})
app.post('/blog/add', async (req, res) => { // Insert Blog Data Into Database
    const insertBlog = await Blogs.create(req.body);
    res
        .status(201)
        .send({ success: true });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})