// 1. Fetch your comprehensive OG dataset file
fetch('/sabrvalues/ogbrdata.json?v=1.1')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const directory = document.getElementById('directory-grid');
        directory.innerHTML = ''; // Clear out the loading placeholder text

        // 2. Loop through every single unit inside your JSON array
            data.og_units.forEach(unit => {
            // Create the structural button card element
            const btn = document.createElement('div');
            btn.className = 'img-directory-btn';
            
            // Set up the path to look inside your new images folder using the unit's id
            const imageFilename = `/sabrvalues/images/${unit.id}.png`;

            // Build the HTML inside the button (Image + Text)
            btn.innerHTML = `
                <img src="${imageFilename}" alt="${unit.name}" class="btn-item-thumb" onerror="this.src='https://placehold.co/240x180/111318/ffffff?text=No+Image'">
                <div class="btn-item-name">${unit.name}</div>
            `;

            // 3. INTERACTIVE TRIGGER: When someone clicks this button, open the modal popup with its data
            btn.onclick = () => openModalWithData(unit);

            // Throw the newly created button into your website's directory grid
            directory.appendChild(btn);
        });
    })
    .catch(error => {
        console.error('Data pull failed:', error);
        document.getElementById('directory-grid').innerText = 'Sync Error: Make sure your ogbrdata.json file is formatted correctly without typos!';
    });

// --- Updated Popup Data Modal Window Engine ---
function openModalWithData(unit) {
    const modal = document.getElementById('data-modal');
    const bodyContent = document.getElementById('modal-body-content');

    // 1. Safe check for your custom "Dragon Value" benchmark metric
    let dragValueHTML = '';
    if (unit.drag_value && unit.drag_value !== 'N/A' && unit.drag_value !== '0') {
        dragValueHTML = `<span style="color: #ff9f43;">🐉 Dragon Value: ${unit.drag_value}</span>`;
    } else {
        dragValueHTML = `<span style="color: #57606f;">🐉 Dragon Value: Under 1</span>`;
    }

    // 2. Safe check for Spyder Elephant's unique "status" tag (if it exists)
    let statusHTML = '';
    if (unit.status) {
        statusHTML = `<span class="status-badge status-dropping" style="background: rgba(231, 76, 60, 0.2); color: #e74c3c;">${unit.status}</span>`;
    }

    // 3. Load only your preferred dataset parameters inside the popup layout
    bodyContent.innerHTML = `
        <div class="card-header" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <span class="rarity-badge">${unit.tier}</span>
            ${statusHTML}
        </div>
        <h2 style="font-size: 1.8rem; margin-bottom: 25px; color: #fff; text-transform: uppercase;">${unit.name}</h2>
        
        <div class="stat-line"><span>Income Generation:</span> <span>$${unit.income_per_second}/s</span></div>
        <div class="stat-line"><span>Base Buy Price:</span> <span>$${unit.buy_price}</span></div>
        
        <div class="value-section" style="margin-top: 15px; padding-top: 15px; border-top: 2px solid rgba(255, 255, 255, 0.04);">
            <div class="stat-line">${dragValueHTML}</div>
            <div class="stat-line" style="margin-top: 10px;"><span>Market Demand:</span> <span style="color: #fff;">${unit.demand}</span></div>
        </div>
    `;

    // Make the popup box smoothly appear on screen
    modal.classList.add('active-modal');
}

// Function to shut down the popup overlay
function closeModal() {
    document.getElementById('data-modal').classList.remove('active-modal');
}
