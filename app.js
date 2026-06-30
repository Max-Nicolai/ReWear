// Vervang dit met de werkelijke ID van de Google Sheet
const SHEET_ID = '1YdP2_mH86QvD96XkuNboh43SgY_W6AJzukt0QUiRXss'; 
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

async function fetchSpreadsheetData() {
    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        
        // Google retourneert een beveiligde string die we moeten 'schoonmaken' naar pure JSON
        const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const data = JSON.parse(jsonString);
        
        const rows = data.table.rows;
        const config = {};

        // Loop door de rijen en zet ze om naar een handig key-value object
        rows.forEach(row => {
            const key = row.c[0] ? row.c[0].v : null;
            const value = row.c[1] ? row.c[1].v : null;
            if (key) config[key.toLowerCase().trim()] = value;
        });

        // Update de DOM met de opgehaalde data
        updateDOM(config);

    } catch (error) {
        console.error("Fout bij het ophalen van de contactgegevens:", error);
    }
}

function updateDOM(config) {
    // Klasse 'italic text-gray-400' weghalen zodra de data er is voor een strakke look
    const removeLoadingStyle = (element) => {
        if (element) {
            element.classList.remove('italic', 'text-gray-400');
        }
    };

    // Vul het adres in
    if (config.adres) {
        const adresEl = document.getElementById('data-adres');
        adresEl.innerText = config.adres;
        removeLoadingStyle(adresEl);
    }
    
    // Vul de e-mailadressen in
    if (config.email) {
        const emailEl = document.getElementById('data-email');
        const donateEmailEl = document.getElementById('donate-email');
        
        emailEl.innerText = config.email;
        donateEmailEl.innerText = config.email;
        document.getElementById('link-email').href = `mailto:${config.email}`;
        
        removeLoadingStyle(emailEl);
        removeLoadingStyle(donateEmailEl);
    }
    
    // Vul de IBAN in
    if (config.iban) {
        const ibanEl = document.getElementById('data-iban');
        ibanEl.innerText = config.iban;
        removeLoadingStyle(ibanEl);
    }
    
    // Vul het KvK-nummer in (indien aangepast in sheet, anders blijft HTML fallback)
    if (config.kvk) {
        document.getElementById('data-kvk').innerText = config.kvk;
    }
    
    // Vul het telefoonnummer in
    if (config.telefoon) {
        const telEl = document.getElementById('data-telefoon');
        telEl.innerText = config.telefoon;
        document.getElementById('link-telefoon').href = `tel:${config.telefoon}`;
        removeLoadingStyle(telEl);
    }

    // NIEUW: Vul de openingstijden in
    if (config.openingstijden) {
        const openingEl = document.getElementById('data-openingstijden');
        openingEl.innerText = config.openingstijden;
        removeLoadingStyle(openingEl);
    }
}

// Start het ophalen zodra de pagina geladen is
document.addEventListener('DOMContentLoaded', fetchSpreadsheetData);