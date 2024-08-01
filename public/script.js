document.addEventListener('DOMContentLoaded', () => {
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
            showAlert('Please fill in all fields.', 'error');
            return;
        }

        // Simulate login functionality
        showAlert(`Logged in with Email: ${email}`, 'success');

        form.reset();
    });

    // Function to dynamically update featured and recent posts
    const updatePosts = async () => {
        const featuredPostsContainer = document.querySelector('.posts-grid');
        const recentPostsContainer = document.querySelector('.posts-list');

        // Show loading spinner
        showLoadingSpinner(featuredPostsContainer);
        showLoadingSpinner(recentPostsContainer);

        try {
            const response = await fetch('/posts');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const posts = await response.json();

            // Remove loading spinner
            removeLoadingSpinner(featuredPostsContainer);
            removeLoadingSpinner(recentPostsContainer);


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

            // Add hover animations to new post items
            addHoverAnimations();
        } catch (error) {
            showAlert('Failed to load posts. Please try again later.', 'error');
            console.error('Error fetching posts:', error);
        }
    };

    // Update posts on page load
    updatePosts();

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
            input.style.boxShadow = '0 0 5px rgba(0, 123, 255, 
