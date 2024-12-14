document.addEventListener('DOMContentLoaded', function () {
    // Add new search links dynamically
    const searchResultsList = document.getElementById('searchList');

    const links = [
        { href: 'https://bibekchandsah.github.io/bibeksha/qr%20code%20generator.html', text: 'QR Code Generator' },
        { href: 'https://bibekchandsah.github.io/linksaver/', text: 'Link Saver' },
        { href: 'https://bibekchandsah.github.io/event-calendar/', text: 'Event Calendar' },
        { href: 'https://bibekchandsah.github.io/calendar/', text: 'Calendar' },
        { href: 'https://bibekchandsah.github.io/dailyQuote/', text: 'Daily Quotes' },
        { href: 'https://github.com/bibekchandsah/pickupline', text: 'Pickup Line' },
        { href: 'https://bibekchandsah.github.io/bibeksah48/youtube.html', text: 'YouTube Videos' },
        { href: 'https://bibekchandsah.github.io/bibeksah48/websites.html', text: 'Extensions' },
        { href: 'https://vscode.dev/', text: 'VsCode Web' },
        { href: 'https://insiders.vscode.dev/', text: 'Insider VsCode Web' },
        { href: 'https://www.canva.com/', text: 'Canva' },
        { href: 'https://1drv.ms/x/s!AiNuwFrvg4udgfoYyVdeIlivIIb4Kw?e=jrSUg6', text: 'Image prompt' },
        { href: 'https://1drv.ms/x/s!AiNuwFrvg4udgeIa6_8F2xmN-0siQw?e=UwFk28', text: 'Music list' },
        { href: 'https://codepen.io/pen/tour/welcome/start', text: 'Codepen html editor' },
        { href: 'https://codepen.io/trending', text: 'Codepen search' },
        { href: 'https://github.com/kamranahmedse/developer-roadmap?tab=readme-ov-file', text: 'Road map for CSE' },
        { href: 'https://hacksnation.com/d/19956-github-repositories-every-developer-should-know', text: 'Github repositories for developer' },
        { href: 'https://hacksnation.com/d/21797-chat-gpt-40-miror-sites', text: 'Chat GPT mirror sites' },
        { href: 'https://chat.lmsys.org/', text: 'All AI for query' },
        { href: 'https://bibekchandsah.github.io/kiitcse', text: 'KIIT CSE' },
        { href: 'https://github.com/bibekchandsah/feedback', text: 'Feedback' },
        { href: 'https://github.com/bibekchandsah/Homepage', text: 'Homepage' },
        { href: 'https://github.com/bibekchandsah/CSE', text: 'CSE' },
        { href: 'https://github.com/bibekchandsah/Music', text: 'Music' },
        { href: 'https://github.com/bibekchandsah/bibek', text: 'bibek' },
        { href: 'https://github.com/bibekchandsah/event-calendar', text: 'event-calendar' },
        { href: 'https://github.com/bibekchandsah/calendar', text: 'calendar' },
        { href: 'https://github.com/bibekchandsah/dailyQuote', text: 'dailyQuote' },
        { href: 'https://github.com/bibekchandsah/youtube-resume-button', text: 'youtube-resume-button' },
        { href: 'https://github.com/bibekchandsah/video-PIP-Instagram', text: 'video-PIP-Instagram' },
        { href: 'https://github.com/bibekchandsah/showTime', text: 'showTime' },
        { href: 'https://github.com/bibekchandsah/linksaver', text: 'linksaver' },
        { href: 'https://github.com/bibekchandsah/pickupline', text: 'pickupline' },
        { href: 'https://github.com/bibekchandsah/GoogleFormHelper', text: 'GoogleFormHelper' },
        { href: 'https://github.com/bibekchandsah/documents', text: 'documents' },
        { href: 'https://github.com/bibekchandsah/qr-code-reader-or-scanner', text: 'qr-code-reader-or-scanner' },
        { href: 'https://github.com/bibekchandsah/bibeksah48', text: 'bibeksah48' },
        { href: 'https://github.com/bibekchandsah/Water-droplet', text: 'Water-droplet' },
        { href: 'https://github.com/bibekchandsah/google-search', text: 'google-search' },
        { href: 'https://github.com/bibekchandsah/tutorial-point-all-pdf', text: 'tutorial-point-all-pdf' },
        { href: 'https://github.com/bibekchandsah/3d-text-rotating', text: '3d-text-rotating' },
        { href: 'https://github.com/bibekchandsah/Weird-Card-Design', text: 'Weird-Card-Design' },
        { href: 'https://github.com/bibekchandsah/back-to-top', text: 'back-to-top' },
        { href: 'https://github.com/bibekchandsah/3D-foldable-file', text: '3D-foldable-file' },
        { href: 'https://github.com/bibekchandsah/custom-scroll-bar', text: 'custom-scroll-bar' },
        { href: 'https://github.com/bibekchandsah/dropdown', text: 'dropdown' },
        { href: 'https://github.com/bibekchandsah/light-and-dark-official', text: 'light-and-dark-official' },
        { href: 'https://github.com/bibekchandsah/navigate-in-same-page', text: 'navigate-in-same-page' },
        { href: 'https://github.com/bibekchandsah/parallax-mountain', text: 'parallax-mountain' },
        { href: 'https://github.com/bibekchandsah/pop-up-after-load-page', text: 'pop-up-after-load-page' },
        { href: 'https://github.com/bibekchandsah/pop-up-email', text: 'pop-up-email' },
        { href: 'https://github.com/bibekchandsah/responsive-nav-bar', text: 'responsive-nav-bar' },
        { href: 'https://github.com/bibekchandsah/responsive-signup-nav-bar', text: 'responsive-signup-nav-bar' },
        { href: 'https://github.com/bibekchandsah/slide-show-with-nav-indicator', text: 'slide-show-with-nav-indicator' },
        { href: 'https://github.com/bibekchandsah/sticky-nav-bar', text: 'sticky-nav-bar' },
        { href: 'https://github.com/bibekchandsah/text-typing-loading-animation-effects', text: 'text-typing-loading-animation-effects' },
        { href: 'https://github.com/bibekchandsah/card', text: 'card' },
        { href: 'https://github.com/bibekchandsah/chat-bot', text: 'chat-bot' },
        { href: 'https://github.com/bibekchandsah/3d-effect', text: '3d-effect' },
        { href: 'https://github.com/bibekchandsah/double-nav-barr', text: 'double-nav-barr' },
        { href: 'https://github.com/bibekchandsah/css-border', text: 'css-border' },
        { href: 'https://github.com/bibekchandsah/double-nav-bar', text: 'double-nav-bar' },
        { href: 'https://github.com/bibekchandsah/small-piece-of-paper-falling-down', text: 'small-piece-of-paper-falling-down' },
        { href: 'https://github.com/bibekchandsah/working-google-search-engine', text: 'working-google-search-engine' },
        { href: 'https://github.com/bibekchandsah/image-comparison', text: 'image-comparison' },
        { href: 'https://github.com/bibekchandsah/Template', text: 'Template' },

    ];

    links.forEach(linkInfo => {
        const newLink = document.createElement('a');
        newLink.href = linkInfo.href;
        newLink.textContent = linkInfo.text;
        newLink.className = 'list-group-item list-group-item-action';
        newLink.target = '_blank'; // Open in new tab
        searchResultsList.appendChild(newLink);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const resultsBox = document.getElementById("searchList");
    const inputBox = document.getElementById("input-box");
    const clearIcon = document.querySelector('.clear-icon');

    // Ensure the clear icon is hidden initially
    clearIcon.style.display = 'none';

    // Filter the list based on input
    inputBox.addEventListener("input", function () {
        const filterText = inputBox.value.trim().toLowerCase();

        // Toggle the clear icon based on input value
        toggleClearIcon();

        // Get all list items
        const listItems = resultsBox.querySelectorAll(".list-group-item");

        // Loop through list items to filter
        listItems.forEach(function (item) {
            const text = item.textContent.trim().toLowerCase();
            if (text.includes(filterText)) {
                item.style.display = ""; // Show matching items
            } else {
                item.style.display = "none"; // Hide non-matching items
            }
        });
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
