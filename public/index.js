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
const users = [
    { username: 'admin', password: 'adminpass', isAdmin: true },
    { username: 'user1', password: 'password1', isAdmin: false }
];

// Sample data for posts
const posts = [
    { id: 1, title: 'First Post', description: 'This is the first post', imgSrc: 'image1.jpg', link: 'link1' },
    { id: 2, title: 'Dynamic Post 1', description: 'This is a dynamically added post description.', imgSrc: 'path/to/dynamic-image1.jpg', link: 'link/to/dynamic-post1' },
    { id: 3, title: 'Dynamic Post 2', description: 'This is another dynamically added post description.', imgSrc: 'path/to/dynamic-image2.jpg', link: 'link/to/dynamic-post2' },
    { id: 4, title: 'Dynamic Post 3', description: 'Yet another dynamic post added for demonstration.', imgSrc: 'path/to/dynamic-image3.jpg', link: 'link/to/dynamic-post3' }
];

// Login endpoint to get a token
app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Generate a token
            const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '30m' });
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Something broke!' });
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

// Middleware to log user activity
const userActivities = [];

function logUserActivity(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error('Authorization header missing');
            return res.status(401).send('Unauthorized');
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) return res.status(401).send('Unauthorized');
            const username = decoded.username;
            const activity = {
                username,
                method: req.method,
                endpoint: req.originalUrl,
                timestamp: new Date()
            };
            userActivities.push(activity);
            next();
        });
    } catch (error) {
        console.error('Error logging user activity:', error);
        res.status(500).send('Internal Server Error');
    }
}

app.use(logUserActivity);

// Routes
app.get('/posts', authenticate, (req, res) => {
    res.status(200).json({ message: 'Posts retrieved successfully', posts });
});

// Admin middleware to check if user is admin
function isAdmin(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).send('Unauthorized');
        const user = users.find(u => u.username === decoded.username);
        if (user && user.isAdmin) {
            next();
        } else {
            res.status(403).send('Forbidden');
        }
    });
}

// Admin routes
app.use('/admin', authenticate, isAdmin);

app.get('/admin/dashboard', (req, res) => {
    res.send('Welcome to the admin dashboard');
});

app.post('/admin/kick-out', (req, res) => {
    const { username } = req.body;
    // Implement logic to kick out the user (e.g., removing them from a session list)
    res.send(`User ${username} has been kicked out.`);
});

app.put('/admin/edit-post/:id', (req, res) => {
    const postId = req.params.id;
    const { title, description, imgSrc, link } = req.body;
    const post = posts.find(p => p.id == postId);
    if (post) {
        post.title = title;
        post.description = description;
        post.imgSrc = imgSrc;
        post.link = link;
        res.send(`Post ${postId} has been edited.`);
    } else {
        res.status(404).send('Post not found');
    }
});

app.delete('/admin/delete-post/:id', (req, res) => {
    const postId = req.params.id;
    const index = posts.findIndex(p => p.id == postId);
    if (index > -1) {
        posts.splice(index, 1);
        res.send(`Post ${postId} has been deleted.`);
    } else {
        res.status(404).send('Post not found');
    }
});

// Endpoint to view user activity (accessible only to admins)
app.get('/admin/user-activity', (req, res) => {
    res.json(userActivities);
});

// Improve error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
