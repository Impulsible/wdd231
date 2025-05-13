
// Ensure to only declare these variables once and not re-declare them inside any function

// Fetch the members data
function loadMembers() {
    fetch('chamber/members.json')  // Ensure path is correct relative to HTML file
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json();
        })
        .then(data => {
    displayMembersByCategory(data); // Pass entire grouped object
});

}

// Display the members data
function displayMembersByCategory(groupedData) {
    const container = document.querySelector('#members');
    if (!container) {
        console.error('Container element with ID "members" not found.');
        return;
    }

    for (const category in groupedData) {
        // Create and style category section
        const categorySection = document.createElement('div');
        categorySection.classList.add('category-section');

        const title = document.createElement('h2');
        title.textContent = category;
        categorySection.appendChild(title);

        const cardRow = document.createElement('div');
        cardRow.classList.add('card-row'); // horizontal scrolling row

        groupedData[category].forEach(member => {
            const card = document.createElement('section');
            card.classList.add('member-card');

            const {
                name = 'No Name Provided',
                image = 'default.jpg',
                address = 'No address available',
                phone = 'No phone number',
                membership_level = 'Not specified',
                description = '',
                website = '#'
            } = member;

            card.innerHTML = `
                <img src="images/${image}" alt="Logo of ${name}" loading="lazy"
                    onerror="this.onerror=null; this.src='images/download.png';">
                <h3>${name}</h3>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Membership:</strong> ${membership_level}</p>
                <p>${description}</p>
                <a href="${website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
            `;
            cardRow.appendChild(card);
        });

        categorySection.appendChild(cardRow);
        container.appendChild(categorySection);
    }
}


// Toggle Grid/List View
gridBtn.addEventListener('click', () => {
    directoryContent.classList.add('grid-view');
    directoryContent.classList.remove('list-view');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
});

listBtn.addEventListener('click', () => {
    directoryContent.classList.add('list-view');
    directoryContent.classList.remove('grid-view');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
});



// Dynamic year and last modified date
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("last-modified").textContent = document.lastModified;

