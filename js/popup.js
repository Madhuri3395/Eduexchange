document.addEventListener('DOMContentLoaded', function() {
    setTimeout(openPopup, 1500); // Adjust the timing as needed
    const servicesLink = document.querySelector('.nav-link.services');
    const viewLink = document.querySelector('.view-link'); // Ensure the class matches your HTML
    if (servicesLink) {
        servicesLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link action
            openPopup();
        });
    }
    
});



function openPopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'flex';
    } else {
        console.error('Popup element not found');
    }
}

function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'none';
    } else {
        console.error('Popup element not found');
    }
}

function signIn() {
    location.href = '/who';
    closePopup();
}

function noThanks() {
    location.href = '/who';
    closePopup();
}
