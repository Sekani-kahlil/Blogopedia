document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevents the default form submission behavior
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        alert("Email: " + email + "\nPassword: " + password);
    });
});
