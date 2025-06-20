document.addEventListener('DOMContentLoaded', function () {
    // Add new search links dynamically
    const searchResultsList = document.getElementById('searchList');
    const resultsBox = document.getElementById("searchList");
    const inputBox = document.getElementById("input-box");
    const clearIcon = document.querySelector('.clear-icon');

    // Ensure the clear icon is hidden initially
    clearIcon.style.display = 'none';

    // Fetch and render links
    fetch('assets/js/list.json')
        .then(response => response.json())
        .then(links => {
            links.forEach(linkInfo => {
                const newLink = document.createElement('a');
                newLink.href = linkInfo.href;
                newLink.textContent = linkInfo.text;
                newLink.className = 'list-group-item list-group-item-action';
                newLink.target = '_blank'; // Open in new tab
                searchResultsList.appendChild(newLink);
            });
        })
        .catch(error => {
            console.error('Error loading links:', error);
        });

    // Filter the list based on input
    inputBox.addEventListener("input", function () {
        const filterText = inputBox.value.trim().toLowerCase();

        // Toggle the clear icon based on input value
        toggleClearIcon();

        // Get all list items
        const listItems = resultsBox.querySelectorAll(".list-group-item");

        // Track if any item is visible
        let anyVisible = false;

        // Loop through list items to filter
        listItems.forEach(function (item) {
            const text = item.textContent.trim().toLowerCase();
            if (text.includes(filterText)) {
                item.style.display = ""; // Show matching items
                anyVisible = true;
            } else {
                item.style.display = "none"; // Hide non-matching items
            }
        });

        // Show/hide the "No results" message
        const noResults = document.getElementById("no-results-message");
        if (noResults) {
            noResults.style.display = anyVisible ? "none" : "block";
        }
    });

    // Trigger search on Enter key
    inputBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission or default behavior
            searchGoogle(); // Call the search function
        }
    });
});

// Search functionality
// function searchOnEnter(event) {
//     if (event.keyCode === 13) {
//         searchGoogle();
//     }
// }

function searchGoogle() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    if (query !== '') {
        const searchUrl = 'https://www.bing.com/search?q=' + encodeURIComponent(query);
        window.open(searchUrl, '_blank');
        searchInput.select(); // Select text after searching
    }
}

// Toggle clear icon
function toggleClearIcon() {
    const input = document.querySelector('.search-input');
    const clearIcon = document.querySelector('.clear-icon');
    // clearIcon.style.display = input.value.trim() ? 'block' : 'none';
    clearIcon.style.display = input.value.trim() !== '' ? 'block' : 'none';
}

// Clear search input
function clearSearchInput() {
    const input = document.querySelector('.search-input');
    input.value = '';
    toggleClearIcon(); // Hide the clear icon after clearing
    input.dispatchEvent(new Event('input')); // Trigger input event to reset the list filter
    input.focus(); // Focus back on the input box
}
