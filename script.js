// Connect directly to your comprehensive OG dataset file
fetch('ogbrdata.json')
    .then(response => response.json())
    .then(data => {
        const directory = document.getElementById('directory-grid');
        directory.innerHTML = ''; // Clear default load strings

        // Read records inside the data array
        data.secret_units.forEach(unit => {
            // Create a structural link card button
            const btn = document.createElement('div');
            btn.className = 'img-directory-btn';
            
            // Inside your script.js data looping logic:
        const imageFilename = `images/${unit.id}.png`;

            btn.innerHTML = `
            <img src="${imageFilename}" alt="${unit.name}" class="btn-item-thumb" onerror="this.src='https://placehold.co/240x180/111318/ffffff?text=No+Image'">
            <div class="btn-item-name">${unit.name}</div>
`;

            // When clicked, trigger the popup display showing the parameters
            btn.onclick = () => openModalWithData(unit);

            directory.appendChild(btn);
        });
    })
    .catch(error => {
        console.error('Data pull failed:', error);
        document.getElementById('directory-grid').innerText = 'Sync Error: Check if ogbrdata.json is compiled cleanly.';
    });

// --- Modal Display Engine ---
function openModalWithData(unit) {
    const modal = document.getElementById('data-modal');
    const bodyContent = document.getElementById('modal-body-content');

    let dragValueHTML = '';
    if (unit.drag_value && unit.drag_value !== 'N/A' && unit.drag_value !== '0') {
        dragValueHTML = `<span style="color: #ff9f43;">🐉 Dragon Value: ${unit.drag_value}</span>`;
    } else {
        dragValueHTML = `<span style="color: #57606f;">🐉 Dragon Value: Under 1</span>`;
    }

    // Load full dataset records right inside the pop-up window frame
    bodyContent.innerHTML = `
        <div class="card-header" style="margin-bottom:20px;">
            <span class="rarity-badge">${unit.tier}</span>
            <span class="status-badge status-${unit.status.toLowerCase()}">${unit.status}</span>
        </div>
        <h2 style="font-size:1.8rem; margin-bottom:25px; color:#fff;">${unit.name}</h2>
        
        <div class="stat-line"><span>Income:</span> <span>$${unit.income_per_second}/s</span></div>
        <div class="stat-line"><span>Buy Price:</span> <span>$${unit.buy_price}</span></div>
        
        <div class="value-section">
            <div class="stat-line"><span>Token Value:</span> <span style="color: #00f2fe;">${unit.trading_value}</span></div>
            <div class="stat-line">${dragValueHTML}</div>
            <div class="stat-line" style="margin-top:10px;"><span>Market Demand:</span> <span style="color:#fff;">${unit.demand}</span></div>
        </div>
    `;

    modal.classList.add('active-modal');
}

function closeModal() {
    document.getElementById('data-modal').classList.remove('active-modal');
}
