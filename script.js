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

// --- Dynamic Item Section Engine ---
function openModalWithData(unit) {
    // 1. Hide all other active pages on your site
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active-page');
    });

    // 2. Grab our dedicated item detail view elements
    const detailPage = document.getElementById('item-detail-page');
    const profileContainer = document.getElementById('dynamic-item-profile');

    // 3. Safe check for your custom "Dragon Value" benchmark metric
    let dragValueHTML = '';
    if (unit.drag_value && unit.drag_value !== 'N/A' && unit.drag_value !== '0') {
        dragValueHTML = `<h3 style="color: #ff9f43; font-size: 2rem; margin: 15px 0;">🐉 Dragon Value: ${unit.drag_value}</h3>`;
    } else {
        dragValueHTML = `<h3 style="color: #57606f; font-size: 2rem; margin: 15px 0;">🐉 Dragon Value: Under 1</h3>`;
    }

    // 4. Safe check for unique status tags (like Spyder Elephant's "Un-Obtainable")
    let statusHTML = '';
    if (unit.status) {
        statusHTML = `<span style="background: rgba(231, 76, 60, 0.2); color: #e74c3c; padding: 6px 15px; border-radius: 8px; font-size: 0.9rem; text-transform: uppercase; border: 1px solid rgba(231, 76, 60, 0.4);">${unit.status}</span>`;
    }

    // 5. Build the dedicated profile screen dynamically using your precise properties
    profileContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, #14161a 0%, #0b0c10 100%); border: 2px solid #00f2fe; border-radius: 24px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <span style="background: rgba(0, 242, 254, 0.15); color: #00f2fe; padding: 6px 15px; border-radius: 8px; font-size: 0.9rem; border: 1px solid rgba(0, 242, 254, 0.3);">${unit.tier} Tier</span>
                ${statusHTML}
            </div>

            <img src="/sabrvalues/images/${unit.id}.png" alt="${unit.name}" style="width: 100%; max-height: 260px; object-fit: contain; margin-bottom: 30px; filter: drop-shadow(0 0 15px rgba(0,242,254,0.2));" onerror="this.src='https://placehold.co/240x180/111318/ffffff?text=No+Image'">
            
            <h2 style="font-size: 2.5rem; color: #fff; text-transform: uppercase; margin-bottom: 25px; border-bottom: 2px solid rgba(255,255,255,0.05); padding-bottom: 15px;">${unit.name}</h2>
            
            <div style="text-align: left; display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; font-size: 1.1rem;"><span style="color: #888;">Income Generation:</span> <span style="color: #fff; font-family: monospace;">$${unit.income_per_second}/s</span></div>
                <div style="display: flex; justify-content: space-between; font-size: 1.1rem;"><span style="color: #888;">Base Buy Price:</span> <span style="color: #fff; font-family: monospace;">$${unit.buy_price}</span></div>
                <div style="display: flex; justify-content: space-between; font-size: 1.1rem;"><span style="color: #888;">Market Demand:</span> <span style="color: #00f2fe;">${unit.demand}</span></div>
            </div>

            ${dragValueHTML}
        </div>
    `;

    // 6. Reveal the newly built item view page smoothly
    detailPage.style.display = 'block';
    detailPage.classList.add('active-page');
}

// --- Navigation function to return back to the main values catalog ---
function goBackToGrid() {
    // Hide the detail view
    document.getElementById('item-detail-page').style.display = 'none';
    document.getElementById('item-detail-page').classList.remove('active-page');

    // Show the values grid page
    const valuesPage = document.getElementById('values-page');
    valuesPage.style.display = 'block';
    valuesPage.classList.add('active-page');
}
