const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory user storage (for production, use a database)
let users = {};

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

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
        req.user = decoded;
        next();
    });
});

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

// Register route to serve the registration form
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Handle registration form submission
app.post('/register', [
    check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const verificationToken = Math.random().toString(36).substr(2);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        users[verificationToken] = { username, email, password: hashedPassword, verified: false };

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Hello ${username},\n\nPlease verify your email by clicking the link: \nhttp://localhost:${PORT}/verify/${verificationToken}\n\nThank you!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error sending verification email.');
            }
            console.log('Email sent: ' + info.response);
            res.status(200).send('Registration successful! Please check your email for verification.');
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal server error');
    }
});

// Handle email verification
app.get('/verify/:token', (req, res) => {
    const token = req.params.token;
    const user = users[token];

    if (user) {
        user.verified = true;
        const jwtToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send(`Email verified! You can now log in. Use this token for authentication: ${jwtToken}`);
    } else {
        res.status(400).send('Invalid token.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
