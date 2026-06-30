// Vervang dit met de werkelijke ID van de Google Sheet (te vinden in de URL van de sheet)
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
        // Eventueel fallback tekst tonen als de API faalt
    }
}

function updateDOM(config) {
    // Vul de tekstvelden in
    if(config.adres) document.getElementById('data-adres').innerText = config.adres;
    if(config.email) {
        document.getElementById('data-email').innerText = config.email;
        document.getElementById('donate-email').innerText = config.email;
        document.getElementById('link-email').href = `mailto:${config.email}`;
    }
    if(config.iban) document.getElementById('data-iban').innerText = config.iban;
    if(config.kvk) document.getElementById('data-kvk').innerText = config.kvk;
    
    if(config.telefoon) {
        document.getElementById('data-telefoon').innerText = config.telefoon;
        document.getElementById('link-telefoon').href = `tel:${config.telefoon}`;
    }

    // Verwijder loading klasses
    document.querySelectorAll('.loading').forEach(el => el.classList.remove('loading'));
}

// Start het ophalen zodra de pagina geladen is
document.addEventListener('DOMContentLoaded', fetchSpreadsheetData);