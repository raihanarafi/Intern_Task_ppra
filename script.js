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
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = htmlContent;
            }
        })
        .catch(error => {
            console.error("Error loading component:", error);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<p style="color:red; padding:20px;">Failed to load ${filePath}. Error: ${error.message}</p>`;
            }
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

// --- OPTIMIZED SMOOTH SCROLL OBSERVER FUNCTION ---
function setupScrollVisibilityObservers() {
    const sidebar = document.querySelector('.social-sidebar');
    const header = document.getElementById('header-container');
    
    const procurementHeaderSection = document.querySelector('.info-section-header');
    const vendorSection = document.querySelector('.vendor-registration-section');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY || window.pageYOffset;

        // --- SMART SIDEBAR DIRECTION LOGIC ---
        if (sidebar) {
            if (currentScroll <= 50) {
                sidebar.classList.remove('sidebar-hidden');
            } else if (currentScroll > lastScrollTop) {
                sidebar.classList.add('sidebar-hidden');
            } else {
                sidebar.classList.remove('sidebar-hidden');
            }
        }

        // --- INSTANT HEADER EXCEPTION COLLAPSE MATRIX ---
        if (header) {
            const procRect = procurementHeaderSection ? procurementHeaderSection.getBoundingClientRect() : null;
            const vendRect = vendorSection ? vendorSection.getBoundingClientRect() : null;
            const footRect = footerPlaceholder ? footerPlaceholder.getBoundingClientRect() : null;
            
            const procVisible = procRect && procRect.top < window.innerHeight && procRect.bottom > 0;
            const vendVisible = vendRect && vendRect.top < window.innerHeight && vendRect.bottom > 0;
            const footVisible = footRect && footRect.top < window.innerHeight && footRect.bottom > 0;

            if (procVisible || vendVisible || footVisible) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
}

// --- NAVIGATION ROUTING HUB ---
function initializeNavigationRoutes() {
    const homeLink = document.getElementById("nav-home");
    const aboutLink = document.getElementById("nav-about-us");

    // Helper function to handle swap highlighting
    function updateActiveStateLink(clickedLink) {
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.classList.remove("active");
        });
        clickedLink.classList.add("active");
    }

    // --- CASE A: CLICKING THE HOME NAV LINK ---
    if (homeLink) {
        homeLink.addEventListener("click", function(event) {
            event.preventDefault();

            // Dynamic inclusion load of home layout markup content
            includeComponent('page-content-wrapper', './home.html')
                .then(() => {
                    initializeCarousel();
                    updateActiveStateLink(homeLink);
                    setupScrollVisibilityObservers();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                });
        });
    }

    // --- CASE B: CLICKING THE ABOUT US NAV LINK ---
    if (aboutLink) {
        aboutLink.addEventListener("click", function(event) {
            event.preventDefault();

            fetch("about.html")
                .then(response => {
                    if (!response.ok) throw new Error("Could not find about.html");
                    return response.text();
                })
                .then(aboutMarkup => {
                    const pageWrapper = document.getElementById("page-content-wrapper");
                    if (pageWrapper) {
                        pageWrapper.innerHTML = aboutMarkup;
                    }
                    updateActiveStateLink(aboutLink);
                    setupScrollVisibilityObservers();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                })
                .catch(err => console.error("Navigation routing error:", err));
        });
    }
}

// --- SEQUENTIAL EXECUTION HUB ---
window.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch and load the persistent Header layout component
    includeComponent('header-container', './header.html')
        .then(() => {
            // CRITICAL FIX: Links are now fully inside the DOM. Setup the routes now!
            initializeNavigationRoutes();
            
            // 2. Next, load the initial Home body layer content
            return includeComponent('page-content-wrapper', './home.html');
        })
        .then(() => {
            // Home content is ready, initialize its carousel mechanics
            initializeCarousel();

            // 3. Finally, drop the unified footer components down at the page bottom
            return includeComponent('footer-placeholder', './footer.html');
        })
        .then(() => {
            // Everything is assembled! Turn on the dynamic scroll checking observers
            setupScrollVisibilityObservers();
        });
});