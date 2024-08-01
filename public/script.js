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
            input.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.5)';
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = '#ccc';
            input.style.boxShadow = 'none';
        });
    });

    // Add hover animations to featured posts
    const addHoverAnimations = () => {
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
    };

    addHoverAnimations();

    // Function to show alert messages
    const showAlert = (message, type) => {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    };

    // Function to show loading spinner
    const showLoadingSpinner = (container) => {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        container.appendChild(spinner);
    };

    // Function to remove loading spinner
    const removeLoadingSpinner = (container) => {
        const spinner = container.querySelector('.spinner');
        if (spinner) {
            spinner.remove();
        }
    };

    // Add modal functionality for login
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Sign In</h2>
            <form>
                <label for="modal-email">Email</label>
                <input type="text" id="modal-email" required>
                <label for="modal-password">Password</label>
                <input type="password" id="modal-password" required>
                <input type="submit" value="Sign In">
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const openModal = () => {
        modal.style.display = 'block';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    document.querySelector('.Sign h1').addEventListener('click', openModal);
    document.querySelector('.close-button').addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Handle modal form submission
    const modalForm = modal.querySelector('form');
    modalForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = modalForm.querySelector('#modal-email').value.trim();
        const password = modalForm.querySelector('#modal-password').value.trim();

        if (email === '' || password === '') {
            showAlert('Please fill in all fields.', 'error');
            return;
        }

        showAlert(`Logged in with Email: ${email}`, 'success');
        closeModal();
    });
});
