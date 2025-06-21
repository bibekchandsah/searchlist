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

    // Floating Add Button logic
    const openAddLinkModalBtn = document.getElementById('openAddLinkModalBtn');
    const addLinkModal = document.getElementById('addLinkModal');
    let bsAddLinkModal = null;
    if (addLinkModal) {
        bsAddLinkModal = new bootstrap.Modal(addLinkModal);
    }
    if (openAddLinkModalBtn && bsAddLinkModal) {
        openAddLinkModalBtn.addEventListener('click', function () {
            openAddLinkModal();
        });
    }

    // Delegate add/remove row buttons in the modal
    document.getElementById('multi-link-rows').addEventListener('click', function (e) {
        if (e.target.closest('.add-row')) {
            e.preventDefault();
            addMultiLinkRow();
        } else if (e.target.closest('.remove-row')) {
            e.preventDefault();
            removeMultiLinkRow(e.target.closest('.multi-link-row'));
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

function resetMultiLinkModal() {
    const rowsContainer = document.getElementById('multi-link-rows');
    rowsContainer.innerHTML = '';
    // Add one row by default
    rowsContainer.appendChild(createMultiLinkRow());
    document.getElementById('add-link-message').textContent = '';
}

function createMultiLinkRow() {
    const row = document.createElement('div');
    row.className = 'multi-link-row row mb-2';
    row.innerHTML = `
        <div class="col-5">
            <input type="text" class="form-control link-text" placeholder="Link text (e.g. My Project)">
        </div>
        <div class="col-5">
            <input type="url" class="form-control link-url" placeholder="Link URL (e.g. https://example.com)">
        </div>
        <div class="col-2 d-flex align-items-center">
            <button type="button" class="btn btn-success btn-sm add-row" title="Add another row"><i class="bi bi-plus"></i></button>
            <button type="button" class="btn btn-danger btn-sm remove-row ms-1" title="Remove this row" style="display:none;"><i class="bi bi-dash"></i></button>
        </div>
    `;
    return row;
}

function addMultiLinkRow() {
    const rowsContainer = document.getElementById('multi-link-rows');
    const newRow = createMultiLinkRow();
    rowsContainer.appendChild(newRow);
    updateRemoveButtonsVisibility();
}

function removeMultiLinkRow(rowElem) {
    const rowsContainer = document.getElementById('multi-link-rows');
    if (rowsContainer.children.length > 1) {
        rowElem.remove();
        updateRemoveButtonsVisibility();
    }
}

function updateRemoveButtonsVisibility() {
    const rows = document.querySelectorAll('.multi-link-row');
    rows.forEach((row, idx) => {
        const removeBtn = row.querySelector('.remove-row');
        if (removeBtn) {
            removeBtn.style.display = (rows.length > 1) ? '' : 'none';
        }
    });
}

let editMode = false;
let staticLinks = [
    { href: "https://www.google.com/", text: "Google home page" },
    { href: "https://mail.google.com/mail/u/0/?tab=8m#inbox", text: "G-mail" },
    { href: "https://dialogflow.cloud.google.com/#/agent/personal-assistant-cbub/intents", text: "Google Dialogflow" },
    { href: "https://chrome.google.com/webstore/category/extensions", text: "Google Chrome store" },
    { href: "https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home", text: "Microsoft-Edge-Extensions" }
];
let dynamicLinks = [];

let lastDeleted = null;
let undoTimeout = null;
let editLinkInfo = null; // { type: 'static'|'dynamic', idx: number }

// Authentication variables
let isLoggedIn = false;
let pendingAction = null; // Store what action was requested before login

// Admin credentials (you can change these)
const ADMIN_USERNAME = 'bibek48';
const ADMIN_PASSWORD = 'adminbibek';

function showLoginModal(action) {
    pendingAction = action;
    const loginModal = document.getElementById('loginModal');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('login-message');
    
    // Clear previous inputs and messages
    usernameInput.value = '';
    passwordInput.value = '';
    messageDiv.textContent = '';
    
    if (window.bootstrap && window.bootstrap.Modal) {
        new bootstrap.Modal(loginModal).show();
    }
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageDiv = document.getElementById('login-message');
    
    if (!username || !password) {
        messageDiv.textContent = 'Please enter both username and password.';
        return;
    }
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Login successful!';
        
        // Close login modal
        setTimeout(() => {
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            
            // Execute the pending action
            if (pendingAction) {
                executePendingAction(pendingAction);
                pendingAction = null;
            }
        }, 1000);
    } else {
        messageDiv.textContent = 'Invalid username or password.';
    }
}

function executePendingAction(action) {
    switch(action) {
        case 'admin_mode':
            toggleAdminMode();
            break;
        case 'add_link':
            openAddLinkModal();
            break;
    }
}

function toggleAdminMode() {
    if (!isLoggedIn) {
        showLoginModal('admin_mode');
        return;
    }
    
    editMode = !editMode;
    const editBtn = document.getElementById('edit-mode-btn');
    editBtn.textContent = editMode ? 'Done' : 'Admin Mode';
    renderLinks();
}

function openAddLinkModal() {
    if (!isLoggedIn) {
        showLoginModal('add_link');
        return;
    }
    
    resetMultiLinkModal();
    const addLinkModal = document.getElementById('addLinkModal');
    if (window.bootstrap && window.bootstrap.Modal) {
        new bootstrap.Modal(addLinkModal).show();
    }
}

function renderLinks() {
    const resultsBox = document.getElementById("searchList");
    resultsBox.innerHTML = '';
    // Render static links
    staticLinks.forEach((link, idx) => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        a.className = 'list-group-item list-group-item-action';
        a.target = '_blank';
        if (editMode) {
            a.style.position = 'relative';
            // Edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-warning btn-sm edit-link-btn';
            editBtn.style.position = 'absolute';
            editBtn.style.right = '42px';
            editBtn.style.top = '50%';
            editBtn.style.transform = 'translateY(-50%)';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.title = 'Edit Link';
            editBtn.onclick = (e) => {
                e.preventDefault();
                openEditLinkModal('static', idx);
            };
            a.appendChild(editBtn);
            // Delete button
            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-danger btn-sm delete-link-btn';
            delBtn.style.position = 'absolute';
            delBtn.style.right = '5px';
            delBtn.style.top = '50%';
            delBtn.style.transform = 'translateY(-50%)';
            delBtn.innerHTML = '<i class="bi bi-trash"></i>';
            delBtn.title = 'Delete';
            delBtn.onclick = (e) => {
                e.preventDefault();
                confirmDelete('static', idx, link);
            };
            a.appendChild(delBtn);
        }
        resultsBox.appendChild(a);
    });
    // Render dynamic links
    dynamicLinks.forEach((link, idx) => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        a.className = 'list-group-item list-group-item-action';
        a.target = '_blank';
        if (editMode) {
            a.style.position = 'relative';
            // Edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-warning btn-sm edit-link-btn';
            editBtn.style.position = 'absolute';
            editBtn.style.right = '42px';
            editBtn.style.top = '50%';
            editBtn.style.transform = 'translateY(-50%)';
            editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
            editBtn.title = 'Edit Link';
            editBtn.onclick = (e) => {
                e.preventDefault();
                openEditLinkModal('dynamic', idx);
            };
            a.appendChild(editBtn);
            // Delete button
            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-danger btn-sm delete-link-btn';
            delBtn.style.position = 'absolute';
            delBtn.style.right = '5px';
            delBtn.style.top = '50%';
            delBtn.style.transform = 'translateY(-50%)';
            delBtn.innerHTML = '<i class="bi bi-trash"></i>';
            delBtn.title = 'Delete';
            delBtn.onclick = (e) => {
                e.preventDefault();
                confirmDelete('dynamic', idx, link);
            };
            a.appendChild(delBtn);
        }
        resultsBox.appendChild(a);
    });
}

function showUndoToast() {
    const toast = document.getElementById('undo-toast');
    toast.style.display = 'block';
    clearTimeout(undoTimeout);
    undoTimeout = setTimeout(() => {
        toast.style.display = 'none';
        lastDeleted = null;
    }, 5000);
}

document.getElementById('undo-btn').onclick = async function () {
    const toast = document.getElementById('undo-toast');
    toast.style.display = 'none';
    if (!lastDeleted) return;
    if (lastDeleted.type === 'static') {
        staticLinks.splice(lastDeleted.idx, 0, lastDeleted.link);
        renderLinks();
    } else if (lastDeleted.type === 'dynamic') {
        await undoDynamicLink(lastDeleted.idx, lastDeleted.link);
    }
    lastDeleted = null;
};

async function deleteDynamicLink(idx, silent) {
    const messageDiv = document.getElementById('add-link-message');
    try {
        // Fetch token
        const tokenRes = await fetch('https://raw.githubusercontent.com/bibekchandsah/bin/main/bin.json');
        const tokenJson = await tokenRes.json();
        let token = tokenJson.test;
        token = token.substring(3);
        // Fetch current list.json
        const listRes = await fetch('https://raw.githubusercontent.com/bibekchandsah/searchlist/main/assets/js/list.json');
        let list = await listRes.json();
        // Remove the link at idx
        const removed = list.splice(idx, 1)[0];
        // Update on GitHub
        const shaRes = await fetch('https://api.github.com/repos/bibekchandsah/searchlist/contents/assets/js/list.json');
        const shaJson = await shaRes.json();
        const sha = shaJson.sha;
        const payload = {
            message: `Delete link: ${dynamicLinks[idx].text}`,
            content: btoa(unescape(encodeURIComponent(JSON.stringify(list, null, 2)))),
            sha: sha
        };
        const updateRes = await fetch('https://api.github.com/repos/bibekchandsah/searchlist/contents/assets/js/list.json', {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (updateRes.ok) {
            dynamicLinks.splice(idx, 1);
            renderLinks();
            if (!silent) showUndoToast();
        } else {
            const err = await updateRes.json();
            alert('Error deleting link: ' + (err.message || 'Failed to update file'));
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function undoDynamicLink(idx, link) {
    try {
        // Fetch token
        const tokenRes = await fetch('https://raw.githubusercontent.com/bibekchandsah/bin/main/bin.json');
        const tokenJson = await tokenRes.json();
        let token = tokenJson.test;
        token = token.substring(3);
        // Fetch current list.json
        const listRes = await fetch('https://raw.githubusercontent.com/bibekchandsah/searchlist/main/assets/js/list.json');
        let list = await listRes.json();
        // Insert the link back at idx
        list.splice(idx, 0, link);
        // Update on GitHub
        const shaRes = await fetch('https://api.github.com/repos/bibekchandsah/searchlist/contents/assets/js/list.json');
        const shaJson = await shaRes.json();
        const sha = shaJson.sha;
        const payload = {
            message: `Undo delete link: ${link.text}`,
            content: btoa(unescape(encodeURIComponent(JSON.stringify(list, null, 2)))),
            sha: sha
        };
        const updateRes = await fetch('https://api.github.com/repos/bibekchandsah/searchlist/contents/assets/js/list.json', {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (updateRes.ok) {
            dynamicLinks = list;
            renderLinks();
        } else {
            const err = await updateRes.json();
            alert('Error restoring link: ' + (err.message || 'Failed to update file'));
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Edit modal logic
function openEditLinkModal(type, idx) {
    if (!isLoggedIn) {
        showLoginModal('admin_mode');
        return;
    }
    
    editLinkInfo = { type, idx };
    const modal = document.getElementById('editLinkModal');
    const textInput = document.getElementById('edit-link-text');
    const urlInput = document.getElementById('edit-link-url');
    const msgDiv = document.getElementById('edit-link-message');
    msgDiv.textContent = '';
    if (type === 'static') {
        textInput.value = staticLinks[idx].text;
        urlInput.value = staticLinks[idx].href;
    } else {
        textInput.value = dynamicLinks[idx].text;
        urlInput.value = dynamicLinks[idx].href;
    }
    if (window.bootstrap && window.bootstrap.Modal) {
        new bootstrap.Modal(modal).show();
    }
}

// Update delete confirmation to require authentication
function confirmDelete(type, idx, link) {
    if (!isLoggedIn) {
        showLoginModal('admin_mode');
        return;
    }
    
    if (confirm('Delete this link?')) {
        if (type === 'static') {
            lastDeleted = { type: 'static', idx, link: { ...staticLinks[idx] } };
            staticLinks.splice(idx, 1);
            renderLinks();
            showUndoToast();
        } else {
            lastDeleted = { type: 'dynamic', idx, link: { ...dynamicLinks[idx] } };
            deleteDynamicLink(idx, true);
        }
    }
}

document.getElementById('save-edit-link-btn').onclick = async function () {
    if (!editLinkInfo) return;
    const textInput = document.getElementById('edit-link-text');
    const urlInput = document.getElementById('edit-link-url');
    const msgDiv = document.getElementById('edit-link-message');
    const text = textInput.value.trim();
    const url = urlInput.value.trim();
    if (!text || !url) {
        msgDiv.style.color = 'red';
        msgDiv.textContent = 'Both fields are required!';
        return;
    }
    if (editLinkInfo.type === 'static') {
        staticLinks[editLinkInfo.idx] = { text, href: url };
        renderLinks();
        bootstrap.Modal.getInstance(document.getElementById('editLinkModal')).hide();
    } else {
        // Dynamic: update on GitHub
        try {
            // Fetch token
            const tokenRes = await fetch('https://raw.githubusercontent.com/bibekchandsah/bin/main/bin.json');
            const tokenJson = await tokenRes.json();
            let token = tokenJson.test;
            token = token.substring(3);
            // Fetch current list.json
            const listRes = await fetch('https://raw.githubusercontent.com/bibekchandsah/searchlist/main/assets/js/list.json');
            let list = await listRes.json();
            // Update the link
            list[editLinkInfo.idx] = { text, href: url };
            // Update on GitHub
            const shaRes = await fetch('https://api.github.com/repos/bibekchandsah/searchlist/contents/assets/js/list.json');
            const shaJson = await shaRes.json();
            const sha = shaJson.sha;
            const payload = {
                message: `Edit link: ${text}`,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(list, null, 2)))),
                sha: sha
            };
            const updateRes = await fetch('https://api.github.com/repos/bibekchandsah/searchlist/contents/assets/js/list.json', {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (updateRes.ok) {
                dynamicLinks = list;
                renderLinks();
                bootstrap.Modal.getInstance(document.getElementById('editLinkModal')).hide();
            } else {
                const err = await updateRes.json();
                msgDiv.style.color = 'red';
                msgDiv.textContent = err.message || 'Failed to update file';
            }
        } catch (err) {
            msgDiv.style.color = 'red';
            msgDiv.textContent = err.message;
        }
    }
};

// Edit mode button logic
window.addEventListener('DOMContentLoaded', function () {
    const editBtn = document.getElementById('edit-mode-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function () {
            toggleAdminMode();
        });
    }
});

// Patch: fetch and render dynamic links on load
window.addEventListener('DOMContentLoaded', function () {
    fetch('assets/js/list.json')
        .then(response => response.json())
        .then(links => {
            dynamicLinks = links;
            renderLinks();
        })
        .catch(error => {
            console.error('Error loading links:', error);
        });
});

// Patch: re-render links after adding new links
async function addNewLinks() {
    const messageDiv = document.getElementById('add-link-message');
    const rows = document.querySelectorAll('.multi-link-row');
    let newLinks = [];
    rows.forEach(row => {
        const text = row.querySelector('.link-text').value.trim();
        const url = row.querySelector('.link-url').value.trim();
        if (text && url) {
            newLinks.push({ text, href: url });
        }
    });
    if (newLinks.length === 0) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Please fill at least one valid link.';
        return;
    }
    messageDiv.style.color = 'black';
    messageDiv.textContent = 'Adding...';
    try {
        // 1. Fetch the token from the provided URL
        const tokenRes = await fetch('https://raw.githubusercontent.com/bibekchandsah/bin/main/bin.json');
        const tokenJson = await tokenRes.json();
        let token = tokenJson.test;
        token = token.substring(3); // Remove first 3 letters
        // 2. Fetch the current list.json
        const listRes = await fetch('https://raw.githubusercontent.com/bibekchandsah/searchlist/main/assets/js/list.json');
        let list = await listRes.json();
        // 3. Add all new links
        list = list.concat(newLinks);
        // 4. Get the SHA of the current file (required by GitHub API)
        const shaRes = await fetch('https://api.github.com/repos/bibekchandsah/searchlist/contents/assets/js/list.json');
        const shaJson = await shaRes.json();
        const sha = shaJson.sha;
        // 5. Prepare the payload
        const payload = {
            message: `Add new link(s): ${newLinks.map(l => l.text).join(', ')}`,
            content: btoa(unescape(encodeURIComponent(JSON.stringify(list, null, 2)))), // base64 encode
            sha: sha
        };
        // 6. Update the file on GitHub
        const updateRes = await fetch('https://api.github.com/repos/bibekchandsah/searchlist/contents/assets/js/list.json', {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (updateRes.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Link(s) added successfully!';
            // Update dynamicLinks and re-render
            dynamicLinks = list;
            renderLinks();
            // Close modal after short delay
            setTimeout(() => {
                if (window.bootstrap && window.bootstrap.Modal && addLinkModal) {
                    bootstrap.Modal.getInstance(addLinkModal).hide();
                }
            }, 1000);
        } else {
            const err = await updateRes.json();
            throw new Error(err.message || 'Failed to update file');
        }
    } catch (err) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Error: ' + err.message;
    }
}
