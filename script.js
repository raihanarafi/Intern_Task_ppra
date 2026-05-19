// Reusable function to fetch external HTML files and inject them into containers
function includeComponent(containerId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not fetch the file: ${filePath}`);
            }
            return response.text();
        })
        .then(htmlContent => {
            document.getElementById(containerId).innerHTML = htmlContent;
        })
        .catch(error => console.error("Error loading component:", error));
}

// Execute the function to load the header as soon as the webpage loads
window.addEventListener('DOMContentLoaded', () => {
    includeComponent('header-container', 'header.html');
});