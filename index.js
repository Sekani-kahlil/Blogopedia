const sectionEL = document.getElementsByClassName('hero')  
document.addEventListener('DOMContentLoaded', function() {
    // Your JavaScript code here
    console.log('Document loaded');

    // Example: change the color of the header on click
    var header = document.querySelector('header');
    header.addEventListener('click', function (){
        header.style.backgroundColor = '#555'
    });
});
