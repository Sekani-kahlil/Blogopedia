const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Sample data
const posts = [
    {
        title: 'Dynamic Post 1',
        description: 'This is a dynamically added post description.',
        imgSrc: 'path/to/dynamic-image1.jpg',
        link: 'link/to/dynamic-post1'
    },
    {
        title: 'Dynamic Post 2',
        description: 'This is another dynamically added post description.',
        imgSrc: 'path/to/dynamic-image2.jpg',
        link: 'link/to/dynamic-post2'
    },
    {
        title: 'Dynamic Post 3',
        description: 'Yet another dynamic post added for demonstration.',
        imgSrc: 'path/to/dynamic-image3.jpg',
        link: 'link/to/dynamic-post3'
    }
];

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get posts data
app.get('/posts', (req, res) => {
    try {
        if (!posts.length) {
            throw new Error('No posts found');
        }
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
