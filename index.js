// index.js

document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeInput = document.getElementById('remember_me');
    const submitButton = document.getElementById('submit');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const rememberMe = rememberMeInput.checked;

        // Simple validation
        if (email === '' || password === '') {
            alert('Please fill in all fields.');
            return;
        }

        // Simulate login functionality
        alert(`Logged in with Email: ${email}\nPassword: ${password}\nRemember Me: ${rememberMe}`);

        // Clear the form
        form.reset();
    });

    // Function to dynamically update featured and recent posts
    const updatePosts = () => {
        const featuredPostsContainer = document.querySelector('.posts-grid');
        const recentPostsContainer = document.querySelector('.posts-list');

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

        posts.forEach(post => {
            // Create featured post item
            const featuredPostItem = document.createElement('div');
            featuredPostItem.className = 'post-item';
            featuredPostItem.innerHTML = `
                <img src="${post.imgSrc}" alt="Post Image">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <a href="${post.link}">Read more</a>
            `;
            featuredPostsContainer.appendChild(featuredPostItem);

            // Create recent post item
            const recentPostItem = document.createElement('div');
            recentPostItem.className = 'post-item';
            recentPostItem.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <a href="${post.link}">Read more</a>
            `;
            recentPostsContainer.appendChild(recentPostItem);
        });
    };

    // Update posts on page load
    updatePosts();

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').split('#')[1];
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Interactivity: highlight input fields on focus
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#007BFF';
            input.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.5)';
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = '#ccc';
            input.style.boxShadow = 'none';
        });
    });

    // Add animations to featured posts on hover
    const postItems = document.querySelectorAll('.post-item');

    postItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            item.style.transform = 'scale(1.05)';
            item.style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseout', () => {
            item.style.transform = 'scale(1)';
        });
    });
});