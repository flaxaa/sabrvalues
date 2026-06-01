// Keep a global copy of the dataset so the Trade Calculator can use it
let globalDataset = []; 

// 1. Fetch your comprehensive OG dataset file
fetch('/sabrvalues/ogbrdata.json?v=1.2') // Incremented version to bust cache
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        globalDataset = data.og_units; // Store the units globally for the calculator
        
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

        // Initialize the trade dropdowns now that data has arrived
        populateTradeDropdowns();
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


// ==========================================
// --- 3. AUTOMATED TRADE CALCULATOR ENGINE ---
// ==========================================
let tradeSideA = [];
let tradeSideB = [];

function populateTradeDropdowns() {
    const selectA = document.getElementById('select-side-a');
    const selectB = document.getElementById('select-side-b');
    
    if(!selectA || !selectB) return; 

    // Sort items by value weight in the dropdown menu so it looks clean
    const sortedDataset = [...globalDataset].sort((a, b) => b.rank_weight - a.rank_weight);

    selectA.innerHTML = '<option value="">-- Select an Item --</option>';
    selectB.innerHTML = '<option value="">-- Select an Item --</option>';

    sortedDataset.forEach(unit => {
        // Skip un-tradable items in the calculator selection
        if(unit.rank_weight === 0 || unit.demand.includes("Un-Tradable")) return;
        
        const option = `<option value="${unit.id}">${unit.name}</option>`;
        selectA.innerHTML += option;
        selectB.innerHTML += option;
    });
}

function addToTrade(side) {
    const selectElement = document.getElementById(`select-side-${side.toLowerCase()}`);
    const unitId = selectElement.value;
    if (!unitId) return;

    const unit = globalDataset.find(u => u.id === unitId);
    
    if (side === 'A') tradeSideA.push(unit);
    else tradeSideB.push(unit);

    updateTradeUI();
}

function removeFromTrade(side, index) {
    if (side === 'A') tradeSideA.splice(index, 1);
    else tradeSideB.splice(index, 1);
    updateTradeUI();
}

function updateTradeUI() {
    let totalWeightA = 0;
    let totalWeightB = 0;
    const listA = document.getElementById('items-side-a');
    const listB = document.getElementById('items-side-b');
    
    listA.innerHTML = '';
    listB.innerHTML = '';

    // Accumulate Side A Value
    tradeSideA.forEach((unit, index) => {
        totalWeightA += unit.rank_weight;
        listA.innerHTML += `
            <div class="trade-row">
                <span>${unit.name}</span>
                <button class="remove-btn" onclick="removeFromTrade('A', ${index})">X</button>
            </div>
        `;
    });

    // Accumulate Side B Value
    tradeSideB.forEach((unit, index) => {
        totalWeightB += unit.rank_weight;
        listB.innerHTML += `
            <div class="trade-row">
                <span>${unit.name}</span>
                <button class="remove-btn" onclick="removeFromTrade('B', ${index})">X</button>
            </div>
        `;
    });

    // Display simplified total calculations based on power tiers
    document.getElementById('total-side-a').innerText = totalWeightA.toFixed(1);
    document.getElementById('total-side-b').innerText = totalWeightB.toFixed(1);

    const resultText = document.getElementById('trade-result-text');
    const diffText = document.getElementById('trade-difference');
    const verdictBox = document.querySelector('.trade-verdict-box');
    
    if (tradeSideA.length === 0 && tradeSideB.length === 0) {
        resultText.innerText = "ADD ITEMS";
        resultText.style.color = "#57606f";
        diffText.innerText = "Difference: 0";
        verdictBox.style.borderColor = "#333";
        return;
    }

    const valueDifference = totalWeightB - totalWeightA;
    diffText.innerText = `Value Margin: ${valueDifference > 0 ? '+' : ''}${valueDifference.toFixed(1)}`;

    // Automated verdict evaluation framework
    // Fair range accounts for minor balance variations (within 0.5 points)
    if (Math.abs(valueDifference) <= 0.5) {
        resultText.innerText = "FAIR (F)";
        resultText.style.color = "#f1c40f"; 
        verdictBox.style.borderColor = "#f1c40f";
    } else if (valueDifference > 0.5) {
        resultText.innerText = "WIN (W)";
        resultText.style.color = "#2ecc71"; 
        verdictBox.style.borderColor = "#2ecc71";
    } else {
        resultText.innerText = "LOSS (L)";
        resultText.style.color = "#e74c3c"; 
        verdictBox.style.borderColor = "#e74c3c";
    }
}
}
