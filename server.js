const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to check for the Authorization header and validate JWT
app.use((req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token is missing or malformed' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = decoded; // Attach user data to request object
        next();
    });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get posts data
app.get('/posts', (req, res) => {
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
