document.addEventListener ('DOMContentLoaded', () => 
    {
    // Configuration for Formspree
    // !!! IMPORTANT !!!
    // REPLACE 'YOUR_FORMSPREE_ENDPOINT' with the unique endpoint URL you get from Formspree.
    // The form will not work until this is updated.
  const FORMSPREE_URL = 'https://formspree.io/f/xanlqbvn';

    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const formStatusModal = document.getElementById('form-status-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const formMessage = document.getElementById('form-message');
    const modalTitle = document.getElementById('modal-title');


    // --- Helper Function to Show Modal (Custom Message Box) ---
    const showModal = (success, message) => {
        if (success) {
            modalTitle.textContent = 'Success!';
            modalTitle.classList.remove('text-red-600');
            modalTitle.classList.add('text-green-600');
        } else {
            modalTitle.textContent = 'Error';
            modalTitle.classList.remove('text-green-600');
            modalTitle.classList.add('text-red-600');
        }
        formMessage.textContent = message;
        formStatusModal.classList.remove('hidden');
    }


    // --- Mobile Menu Toggle ---
    const toggleMenu = () => {
        mobileMenu.classList.toggle('hidden');
        // Changes the hamburger icon to an 'X' when the menu is open
        const iconPath = mobileMenu.classList.contains('hidden') ? 'M4 6h16M4 12h16M4 18h16' : 'M6 18L18 6M6 6l12 12';
        menuButton.querySelector('path').setAttribute('d', iconPath);
    };

    menuButton.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked (for smoother mobile navigation)
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMenu();
            }
        });
    });


    // --- Form Submission Handling (Formspree Integration) ---
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                contactForm.reset();
                showModal(true, 'Your message has been successfully received. We will respond within one business day!');
            } else {
                // Check if Formspree provided an error message
                const data = await response.json();
                let errorMessage = data.error || 'Oops! There was an issue submitting your form. Please try again. Have you updated the FORMSPREE_URL?';
                showModal(false, errorMessage);
            }

        } catch (error) {
            // Handle network errors
            console.error('Network Error:', error);
            showModal(false, 'A network error occurred. Please check your connection and try again.');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });

    // Close Modal Listeners
    closeModalButton.addEventListener('click', () => {
        formStatusModal.classList.add('hidden');
    });
    
    formStatusModal.addEventListener('click', (e) => {
        if (e.target === formStatusModal) {
            formStatusModal.classList.add('hidden');
        }
    });

    // --- Set Current Year in Footer ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
});