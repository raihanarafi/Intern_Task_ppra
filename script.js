// Reusable function to fetch external HTML files and inject them into containers
function includeComponent(containerId, filePath) {
    fetch(filePath)
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

// Execute the function to load the header as soon as the webpage loads
window.addEventListener('DOMContentLoaded', () => {
    // Adding './' explicitly tells the browser to look in the exact same folder
    includeComponent('header-container', './header.html');
});