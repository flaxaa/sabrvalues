// ==========================================
// --- 1. DATA FETCH & GRID BUILDER ---
// ==========================================
fetch('/sabrvalues/ogbrdata.json?v=1.5')
    .then(response => {
        if (!response.ok) throw new Error('Database response failed');
        return response.json();
    })
    .then(data => {
        const directory = document.getElementById('directory-grid');
        if (!directory) return;
        
        directory.innerHTML = ''; // Wipe out the loading text placeholder

        data.og_units.forEach(unit => {
            // Build card container wrapper
            const card = document.createElement('div');
            card.className = 'img-directory-btn';
            
            const imageFilename = `/sabrvalues/images/${unit.id}.png`;

            // Structural inside data payload
            card.innerHTML = `
                <img src="${imageFilename}" alt="${unit.name}" class="btn-item-thumb" onerror="this.src='https://placehold.co/240x180/111318/ffffff?text=No+Image'">
                <div class="btn-item-name">${unit.name}</div>
            `;

            // Click Router: Triggers the dedicated view profile function below
            card.onclick = () => openItemProfile(unit);
            
            directory.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Data loading error:', error);
        const dir = document.getElementById('directory-grid');
        if (dir) dir.innerText = 'Sync Error: Check your database structure.';
    });


// ==========================================
// --- 2. DYNAMIC PROFILE PAGE ENGINE ---
// ==========================================
function openItemProfile(unit) {
    // Hide all main page content screens
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active-page');
    });

    const detailPage = document.getElementById('item-detail-page');
    const profileContainer = document.getElementById('dynamic-item-profile');

    if (!detailPage || !profileContainer) return;

    // Handle Dragon Value strings safely
    let dragValueHTML = '';
    if (unit.drag_value && unit.drag_value !== 'N/A' && unit.drag_value !== '0') {
        dragValueHTML = `<h3 style="color: #ff9f43; font-size: 2rem; margin: 15px 0; text-align: center;">🐉 Dragon Value: ${unit.drag_value}</h3>`;
    } else {
        dragValueHTML = `<h3 style="color: #57606f; font-size: 2rem; margin: 15px 0; text-align: center;">🐉 Dragon Value: Under 1</h3>`;
    }

    // Handle Status Badges cleanly if they exist
    let statusHTML = '';
    if (unit.status) {
        statusHTML = `<span style="background: rgba(231, 76, 60, 0.2); color: #e74c3c; padding: 6px 15px; border-radius: 8px; font-size: 0.9rem; text-transform: uppercase; border: 1px solid rgba(231, 76, 60, 0.4);">${unit.status}</span>`;
    }

    // Inject cleaner, high-tier profile showcase page code
    profileContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, #14161a 0%, #0b0c10 100%); border: 2px solid #00f2fe; border-radius: 24px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <span style="background: rgba(0, 242, 254, 0.15); color: #00f2fe; padding: 6px 15px; border-radius: 8px; font-size: 0.9rem; border: 1px solid rgba(0, 242, 254, 0.3);">${unit.tier} Tier</span>
                ${statusHTML}
            </div>

            <img src="/sabrvalues/images/${unit.id}.png" alt="${unit.name}" style="width: 100%; max-height: 260px; object-fit: contain; margin-bottom: 30px; filter: drop-shadow(0 0 15px rgba(0,242,254,0.2));" onerror="this.src='https://placehold.co/240x180/111318/ffffff?text=No+Image'">
            
            <h2 style="font-size: 2.5rem; color: #fff; text-transform: uppercase; margin-bottom: 25px; border-bottom: 2px solid rgba(255,255,255,0.05); padding-bottom: 15px; text-align: center;">${unit.name}</h2>
            
            <div style="text-align: left; display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; font-size: 1.1rem;"><span style="color: #888;">Income Generation:</span> <span style="color: #fff; font-family: monospace;">$${unit.income_per_second}/s</span></div>
                <div style="display: flex; justify-content: space-between; font-size: 1.1rem;"><span style="color: #888;">Base Buy Price:</span> <span style="color: #fff; font-family: monospace;">$${unit.buy_price}</span></div>
                <div style="display: flex; justify-content: space-between; font-size: 1.1rem;"><span style="color: #888;">Market Demand:</span> <span style="color: #00f2fe;">${unit.demand}</span></div>
            </div>

            ${dragValueHTML}
        </div>
    `;

    // Reveal the freshly built page section
    detailPage.style.display = 'block';
    detailPage.classList.add('active-page');
}

function goBackToGrid() {
    document.getElementById('item-detail-page').style.display = 'none';
    document.getElementById('item-detail-page').classList.remove('active-page');

    const valuesPage = document.getElementById('values-page');
    if (valuesPage) {
        valuesPage.style.display = 'block';
        valuesPage.classList.add('active-page');
    }
}


// ==========================================
// --- 3. NAVBAR SITE PAGE ROUTER ---
// ==========================================
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active-page');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active-page');
    }
}
