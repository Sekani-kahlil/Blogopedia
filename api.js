// Ensure this file is responsible for making API requests

// Function to fetch posts
export async function fetchPosts() {
    const token = 'your_access_token_here'; // Replace with your actual token

    if (!token) {
        console.error('Token is missing');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/posts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            throw new Error('Unauthorized: Authorization header missing or invalid');
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const posts = await response.json();
        console.log('Posts:', posts);
        
        // Process the posts as needed
        // For example, you can call a function to update the UI with the retrieved posts
        updateUIWithPosts(posts);

    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Function to update the UI with posts
function updateUIWithPosts(posts) {
    const featuredPostsContainer = document.querySelector('.posts-grid');
    const recentPostsContainer = document.querySelector('.posts-list');

    // Clear previous posts
    featuredPostsContainer.innerHTML = '';
    recentPostsContainer.innerHTML = '';

    posts.forEach(post => {
        const featuredPostItem = document.createElement('div');
        featuredPostItem.className = 'post-item';
        featuredPostItem.innerHTML = `
            <img src="${post.imgSrc}" alt="Post Image">
            <h3>${post.title}</h3>
            <p>${post.description}</p>
            <a href="${post.link}">Read more</a>
        `;
        featuredPostsContainer.appendChild(featuredPostItem);

        const recentPostItem = document.createElement('div');
        recentPostItem.className = 'post-item';
        recentPostItem.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.description}</p>
            <a href="${post.link}">Read more</a>
        `;
        recentPostsContainer.appendChild(recentPostItem);
    });
}
