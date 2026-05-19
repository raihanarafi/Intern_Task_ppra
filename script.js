// Reusable function to fetch external HTML files and inject them into containers
// Returns the promise chain so we can chain actions sequentially using .then()
function includeComponent(containerId, filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not fetch the file: ${filePath} (Status: ${response.status})`);
            }
            return response.text();
        })
        .then(htmlContent => {
            document.getElementById(containerId).innerHTML = htmlContent;
        })
        .catch(error => {
            console.error("Error loading component:", error);
            // Visual alert on page if it fails so you know exactly why
            document.getElementById(containerId).innerHTML = `<p style="color:red; padding:20px;">Failed to load ${filePath}. Error: ${error.message}</p>`;
        });
}

// Separate function to manage the Hero Carousel mechanics
function initializeCarousel() {
    const slides = document.querySelectorAll(".carousel-slide");
    const nextBtn = document.querySelector(".next-arrow");
    const prevBtn = document.querySelector(".prev-arrow");
    
    // Safety check to avoid console errors if components don't exist on the current page
    if (!slides.length || !nextBtn || !prevBtn) return;

    let currentSlideIndex = 0;
    let slideInterval;

    function showSlide(index) {
        slides[currentSlideIndex].classList.remove("active");
        currentSlideIndex = (index + slides.length) % slides.length;
        slides[currentSlideIndex].classList.add("active");
    }

    function nextSlide() {
        showSlide(currentSlideIndex + 1);
    }

    function prevSlide() {
        showSlide(currentSlideIndex - 1);
    }

    // Button Click Event Listeners
    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetTimer();
    });

    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetTimer();
    });

    // Auto Rotation Loop Settings
    function startTimer() {
        slideInterval = setInterval(nextSlide, 5000); // 5-second rotation cycle
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }

    // Fire up the timer sequence
    startTimer();
}

// --- SEQUENTIAL EXECUTION HUB ---
// Executes layout injections and features safely in order when the DOM contents structure loads
window.addEventListener('DOMContentLoaded', () => {
    // 1. Load the Header components
    includeComponent('header-container', './header.html')
        .then(() => {
            // 2. ONLY run carousel setup after the components are fully injected and ready
            initializeCarousel();
        });
});