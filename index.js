const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Middleware
app.use(bodyParser.json());

// Dummy user data for demonstration
const users = [{ id: 1, username: 'user1', password: 'password1' }];

// Sample data for posts
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

// Login endpoint to get a token
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Generate a token
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Middleware for authentication
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                console.error('Token verification failed:', err);
                return res.status(403).json({ error: 'Forbidden' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Routes
app.get('/posts', authenticate, (req, res) => {
    res.json(posts);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
