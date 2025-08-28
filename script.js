


const $id = (id) => document.getElementById(id);

const amountInput = $id('amount_input');
const sortBySelect = $id('sort_by');
const bodyContainer = $id('body');

const apiUrl = 'https://randomuser.me/api/';
const maxUsers = 1000;
const minUsers = 0;
const timeout = 3000; // 3 seconds


let currentUsers;  //  store fetched users for name switching functionality

// Main event listeners
amountInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        await generateUsers();
    }
});
sortBySelect.addEventListener('change', () => {
    if (currentUsers.length > 0) {
        renderUsers(currentUsers, sortBySelect.value);
    }
});

// Main function 
async function generateUsers() {
    const count = Number(amountInput.value.trim());
    const nameDisplay = sortBySelect.value;

    if (!validateInput(count)) return;

    if (count === 0) {
        clearUserRows();
        // Show no users message
        const noUserDiv = document.createElement('div');
        noUserDiv.className = 'alert alert-info text-center';
        noUserDiv.innerText = 'No users to generate.';
        bodyContainer.parentElement.insertBefore(noUserDiv, bodyContainer);
        setTimeout(() => {
            noUserDiv.remove();
        }, timeout)
        return;
    }

    clearUserRows();

    try {
        const users = await fetchRandomUsers(count);
        displayNewUsers(users, nameDisplay);
    } 
    catch (error) {
        showError(error.message);
    }
}

// Fetch random users from API with error handling
async function fetchRandomUsers(count) {
    try {
        const response = await fetch(`${apiUrl}?results=${count}`);
        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
            throw new Error('Invalid API response.');
        }

        return data.results;
    } 
    catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('Network error: Please check your internet connection.');
        } 
        else {
            throw error;
        }
    }
}
// Display users
function renderUsers(users, nameDisplay) {
    clearUserRows();  // Remove existing rows

    users.forEach(user => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row mb-2';
        
        // add modal toggling to each row
        const newModal = new bootstrap.Modal(document.getElementById('userDescriptionModal'));

        // Open modal on double-click
        rowDiv.addEventListener('dblclick', (event) => {
            event.preventDefault();
            newModal.show();
        });

        const nameCol = document.createElement('div');
        nameCol.className = 'col-md-3 text-center';
        const displayName = (nameDisplay === 'first_name') ? user.name.first : user.name.last;
        nameCol.textContent = displayName;

        const genderCol = document.createElement('div');
        genderCol.className = 'col-md-3 text-center';
        genderCol.textContent = capitalizeFirstLetter(user.gender);

        const emailCol = document.createElement('div');
        emailCol.className = 'col-md-3 text-center text-truncate';
        emailCol.textContent = user.email;

        const countryCol = document.createElement('div');
        countryCol.className = 'col-md-3 text-center';
        countryCol.textContent = user.location.country;

        rowDiv.appendChild(nameCol);
        rowDiv.appendChild(genderCol);
        rowDiv.appendChild(emailCol);
        rowDiv.appendChild(countryCol);

        bodyContainer.appendChild(rowDiv);
    });
}
function displayNewUsers(users, nameDisplay) {
    currentUsers = users;  // assign and store users for name sorting
    renderUsers(currentUsers, nameDisplay);
}

// Show error alert as a div element for three seconds
function showError(message) {
    clearUserRows();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger text-center';
    errorDiv.innerText = message;
    bodyContainer.parentElement.insertBefore(errorDiv, bodyContainer);
    setTimeout(() => {
            errorDiv.remove();
        }, timeout)
    return
}
// Validate user input amount
function validateInput(amount) {
    if (isNaN(amount) || amount === '') {
        showError('Please enter a valid number.');
        return false;
    }
    if (amount <= minUsers || amount >= maxUsers) {
        showError(`Please enter a number between ${minUsers} and ${maxUsers}.`);
        return false;
    }
    return true;
}

// Helper function for gender
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Clear previous user results rows except the header row
function clearUserRows() {
    // Remove all rows after the header row
    while (bodyContainer.children.length > 1) {
        bodyContainer.removeChild(bodyContainer.lastChild);
    }
}

