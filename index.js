/**
 * Cloudflare Worker für Lighter Funding Export
 * Paradex-Style Design mit Charts und Prognosen
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Route: Hauptseite
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(getUploadPage(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // Route: CSV Upload verarbeiten
    if (url.pathname === '/upload' && request.method === 'POST') {
      return handleUpload(request);
    }
    
    // Route: Daten anzeigen
    if (url.pathname === '/view' && request.method === 'POST') {
      return handleView(request);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

/**
 * Verarbeitet den CSV-Upload und extrahiert alle verfügbaren Markets
 */
async function handleUpload(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('csvFile');
    
    if (!file) {
      return new Response('Keine Datei hochgeladen', { status: 400 });
    }
    
    const csvText = await file.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return new Response('CSV-Datei ist leer', { status: 400 });
    }
    
    // Extrahiere alle einzigartigen Markets
    const markets = new Set();
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols[0]) {
        markets.add(cols[0]);
      }
    }
    
    const marketList = Array.from(markets).sort();
    
    // Gebe Auswahlseite zurück
    return new Response(getSelectionPage(csvText, marketList), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
    
  } catch (error) {
    return new Response(`Fehler beim Verarbeiten: ${error.message}`, { status: 500 });
  }
}

/**
 * Verarbeitet die ausgewählten Coins und zeigt die Daten an
 */
async function handleView(request) {
  try {
    const formData = await request.formData();
    const csvData = formData.get('csvData');
    const selectedMarkets = formData.getAll('markets');
    
    if (!csvData || selectedMarkets.length === 0) {
      return new Response('Keine Daten oder Markets ausgewählt', { status: 400 });
    }
    
    const lines = csvData.split('\n').filter(line => line.trim());
    const headers = parseCSVLine(lines[0]);
    
    // Filtere Daten nach ausgewählten Markets
    const filteredData = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (selectedMarkets.includes(cols[0])) {
        filteredData.push(cols);
      }
    }
    
    // Berechne Statistiken pro Market
    const stats = calculateStats(filteredData);
    
    return new Response(getDataPage(headers, filteredData, stats, selectedMarkets), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
    
  } catch (error) {
    return new Response(`Fehler beim Anzeigen: ${error.message}`, { status: 500 });
  }
}

/**
 * Berechnet Statistiken für jeden Market inkl. Jahresprognose
 */
function calculateStats(data) {
  const stats = {};
  
  data.forEach(row => {
    const market = row[0];
    const payment = parseFloat(row[4]) || 0;
    // Rate aus CSV mit 100 multiplizieren für korrekte Darstellung
    const rate = (parseFloat(row[5]?.replace('%', '')) || 0) * 100;
    
    if (!stats[market]) {
      stats[market] = {
        totalPayment: 0,
        avgRate: 0,
        count: 0,
        minRate: Infinity,
        maxRate: -Infinity,
        firstDate: null,
        lastDate: null
      };
    }
    
    stats[market].totalPayment += payment;
    stats[market].avgRate += rate;
    stats[market].count++;
    stats[market].minRate = Math.min(stats[market].minRate, rate);
    stats[market].maxRate = Math.max(stats[market].maxRate, rate);
    
    // Tracking dates for forecast
    const date = new Date(row[2]);
    if (!stats[market].firstDate || date < stats[market].firstDate) {
      stats[market].firstDate = date;
    }
    if (!stats[market].lastDate || date > stats[market].lastDate) {
      stats[market].lastDate = date;
    }
  });
  
  // Berechne Durchschnitte und Prognosen
  Object.keys(stats).forEach(market => {
    stats[market].avgRate = stats[market].avgRate / stats[market].count;
    
    // Berechne Prognose bis Jahresende
    const now = new Date();
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    const daysSinceStart = (stats[market].lastDate - stats[market].firstDate) / (1000 * 60 * 60 * 24);
    const daysToYearEnd = (yearEnd - now) / (1000 * 60 * 60 * 24);
    
    // Durchschnittliches Payment pro Tag
    const avgPaymentPerDay = daysSinceStart > 0 ? stats[market].totalPayment / daysSinceStart : 0;
    
    // Prognostizierte zusätzliche Payments bis Jahresend
    const forecastedAdditional = avgPaymentPerDay * Math.max(0, daysToYearEnd);
    
    stats[market].yearEndForecast = stats[market].totalPayment + forecastedAdditional;
  });
  
  return stats;
}

/**
 * Parst eine CSV-Zeile (berücksichtigt Kommas in Anführungszeichen)
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

/**
 * HTML für die Upload-Seite (Paradex-Style)
 */
function getUploadPage() {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lighter Funding Analytics</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>📊</text></svg>">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0e1a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .disclaimer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(10, 14, 26, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }
    
    .disclaimer-modal {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      max-width: 600px;
      width: 100%;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    }
    
    .disclaimer-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    
    .disclaimer-icon {
      font-size: 32px;
    }
    
    .disclaimer-title {
      font-size: 24px;
      font-weight: 700;
      color: #f1f5f9;
    }
    
    .disclaimer-content {
      color: #e2e8f0;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    
    .disclaimer-content p {
      margin-bottom: 16px;
    }
    
    .disclaimer-content strong {
      color: #10b981;
      font-weight: 600;
    }
    
    .privacy-list {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .privacy-list h3 {
      color: #10b981;
      font-size: 16px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .privacy-list ul {
      list-style: none;
      padding: 0;
    }
    
    .privacy-list li {
      padding: 8px 0;
      color: #e2e8f0;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      line-height: 1.6;
    }
    
    .privacy-list li::before {
      content: "✓";
      color: #10b981;
      font-weight: bold;
      font-size: 18px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    
    .privacy-list li strong {
      display: inline;
    }
    
    .tech-info {
      background: #1e293b;
      border-left: 3px solid #10b981;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 14px;
      color: #cbd5e1;
    }
    
    .disclaimer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
    
    .btn-accept {
      padding: 12px 32px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: block;
      width: auto;
    }
    
    .btn-accept:hover {
      background: #059669;
      transform: translateY(-2px);
    }
    
    .container {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 50px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      display: none;
    }
    
    .container.show {
      display: block;
    }
    
    h1 {
      color: #f1f5f9;
      margin-bottom: 10px;
      font-size: 28px;
      font-weight: 700;
    }
    
    .subtitle {
      color: #64748b;
      margin-bottom: 40px;
      font-size: 14px;
    }
    
    .upload-area {
      border: 2px dashed #334155;
      border-radius: 12px;
      padding: 60px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #1e293b;
    }
    
    .upload-area:hover {
      border-color: #10b981;
      background: #1e293b;
      transform: translateY(-2px);
    }
    
    .upload-area.dragover {
      border-color: #10b981;
      background: #1e293b;
    }
    
    .upload-icon {
      font-size: 48px;
      margin-bottom: 20px;
      opacity: 0.6;
    }
    
    .upload-text {
      color: #e2e8f0;
      font-size: 16px;
      margin-bottom: 10px;
      font-weight: 500;
    }
    
    .upload-subtext {
      color: #64748b;
      font-size: 13px;
    }
    
    input[type="file"] {
      display: none;
    }
    
    .file-info {
      margin-top: 20px;
      padding: 16px;
      background: #1e293b;
      border-radius: 10px;
      border: 1px solid #334155;
      display: none;
    }
    
    .file-info.show {
      display: block;
    }
    
    .file-name {
      color: #10b981;
      font-weight: 500;
    }
    
    .upload-form button {
      width: 100%;
      padding: 14px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 20px;
      transition: all 0.3s ease;
      display: none;
    }
    
    .upload-form button.show {
      display: block;
    }
    
    .upload-form button:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-2px);
    }
    
    .upload-form button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <!-- Privacy Disclaimer Modal -->
  <div class="disclaimer-overlay" id="disclaimerOverlay">
    <div class="disclaimer-modal">
      <div class="disclaimer-header">
        <span class="disclaimer-icon">🔒</span>
        <h2 class="disclaimer-title">Datenschutz & Sicherheit</h2>
      </div>
      
      <div class="disclaimer-content">
        <p>
          Willkommen bei <strong>Lighter Funding Analytics</strong>. Ihre Privatsphäre ist uns wichtig. 
          Diese Anwendung wurde mit maximaler Datensicherheit entwickelt.
        </p>
        
        <div class="privacy-list">
          <h3>🛡️ Datenschutz-Garantien:</h3>
          <ul>
            <li><strong>Keine Speicherung:</strong> Ihre CSV-Datei wird NIEMALS gespeichert</li>
            <li><strong>RAM-Only:</strong> Daten existieren nur im Arbeitsspeicher während der Verarbeitung</li>
            <li><strong>Browser-Temporär:</strong> Daten bleiben nur temporär im Browser zwischengespeichert</li>
            <li><strong>Automatische Löschung:</strong> Seite schließen = Alle Daten sind sofort weg</li>
            <li><strong>100% Privacy-Friendly:</strong> Kein Tracking, keine Logs, keine Weitergabe</li>
          </ul>
        </div>
        
        <div class="tech-info">
          <strong>⚡ Technologie:</strong> Diese App läuft auf Cloudflare Workers mit 
          <strong>Zero Data Persistence</strong> – das bedeutet, dass nach jeder Anfrage 
          der Arbeitsspeicher vollständig geleert wird. Es gibt keine Datenbank, kein Dateisystem 
          und keine Möglichkeit, Ihre Daten zu speichern. Jede Anfrage ist komplett isoliert.
        </div>
        
        <p style="font-size: 14px; color: #94a3b8;">
          <strong>So funktioniert's:</strong> Ihre CSV-Datei wird im RAM verarbeitet → 
          HTML wird generiert → Daten werden gelöscht. Zwischen den Seiten hält nur Ihr 
          Browser die Daten temporär. Kein Server speichert jemals Ihre Informationen.
        </p>
      </div>
      
      <div class="disclaimer-actions">
        <button type="button" class="btn-accept" onclick="acceptDisclaimer()">
          Verstanden – Weiter zur Analyse
        </button>
      </div>
    </div>
  </div>
  
  <div class="container" id="mainContainer">
    <h1>Lighter Funding Analytics</h1>
    <p class="subtitle">CSV-Datei hochladen und analysieren</p>
    
    <form id="uploadForm" class="upload-form" action="/upload" method="POST" enctype="multipart/form-data">
      <div class="upload-area" id="uploadArea">
        <div class="upload-icon">📊</div>
        <div class="upload-text">CSV-Datei hier ablegen</div>
        <div class="upload-subtext">oder klicken zum Auswählen</div>
        <input type="file" id="csvFile" name="csvFile" accept=".csv" required>
      </div>
      
      <div class="file-info" id="fileInfo">
        <span class="file-name" id="fileName"></span>
      </div>
      
      <button type="submit" id="submitBtn">Weiter zur Coin-Auswahl</button>
    </form>
  </div>
  
  <script>
    function acceptDisclaimer() {
      document.getElementById('disclaimerOverlay').style.display = 'none';
      document.getElementById('mainContainer').classList.add('show');
    }
    
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('csvFile');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const submitBtn = document.getElementById('submitBtn');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        fileName.textContent = '✓ ' + e.target.files[0].name;
        fileInfo.classList.add('show');
        submitBtn.classList.add('show');
      }
    });
    
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        fileName.textContent = '✓ ' + e.dataTransfer.files[0].name;
        fileInfo.classList.add('show');
        submitBtn.classList.add('show');
      }
    });
  </script>
</body>
</html>`;
}

/**
 * HTML für die Market-Auswahlseite (Paradex-Style)
 */
function getSelectionPage(csvData, markets) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coins auswählen - Lighter Funding</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>📊</text></svg>">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0e1a;
      color: #e2e8f0;
      min-height: 100vh;
      padding: 40px 20px;
    }
    
    .container {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    
    h1 {
      color: #f1f5f9;
      margin-bottom: 10px;
      font-size: 24px;
      font-weight: 700;
    }
    
    .subtitle {
      color: #64748b;
      margin-bottom: 30px;
      font-size: 14px;
    }
    
    .controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 10px 18px;
      background: #1e293b;
      border: 1px solid #334155;
      color: #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn:hover {
      background: #334155;
      border-color: #475569;
    }
    
    .search-box {
      flex: 1;
      min-width: 200px;
      padding: 10px 14px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      color: #e2e8f0;
      font-size: 14px;
    }
    
    .search-box:focus {
      outline: none;
      border-color: #10b981;
    }
    
    .markets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 12px;
      margin-bottom: 30px;
      max-height: 450px;
      overflow-y: auto;
      padding: 20px;
      background: #1e293b;
      border-radius: 10px;
      border: 1px solid #334155;
    }
    
    .market-item {
      position: relative;
    }
    
    .market-checkbox {
      display: none;
    }
    
    .market-label {
      display: block;
      padding: 12px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      font-weight: 600;
      font-size: 13px;
      transition: all 0.3s ease;
      color: #e2e8f0;
    }
    
    .market-label:hover {
      border-color: #10b981;
      transform: translateY(-2px);
    }
    
    .market-checkbox:checked + .market-label {
      background: #10b981;
      color: #0f172a;
      border-color: #10b981;
    }
    
    .submit-btn {
      width: 100%;
      padding: 14px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .submit-btn:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-2px);
    }
    
    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .selected-count {
      text-align: center;
      margin-bottom: 20px;
      color: #64748b;
      font-size: 14px;
    }
    
    .selected-count strong {
      color: #10b981;
      font-size: 20px;
    }
    
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #1e293b;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #475569;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Markets auswählen</h1>
    <p class="subtitle">Wähle die Coins aus, die analysiert werden sollen</p>
    
    <div class="controls">
      <button type="button" class="btn" onclick="selectAll()">Alle auswählen</button>
      <button type="button" class="btn" onclick="deselectAll()">Alle abwählen</button>
      <input type="text" class="search-box" id="searchBox" placeholder="Suchen..." onkeyup="filterMarkets()">
    </div>
    
    <div class="selected-count">
      <strong id="selectedCount">0</strong> / ${markets.length} Markets
    </div>
    
    <form action="/view" method="POST">
      <input type="hidden" name="csvData" value="${escapeHtml(csvData)}">
      
      <div class="markets-grid" id="marketsGrid">
        ${markets.map(market => `
          <div class="market-item" data-market="${market.toLowerCase()}">
            <input type="checkbox" class="market-checkbox" id="market_${market}" name="markets" value="${market}" onchange="updateCount()">
            <label class="market-label" for="market_${market}">${market}</label>
          </div>
        `).join('')}
      </div>
      
      <button type="submit" class="submit-btn" id="submitBtn" disabled>Analyse starten</button>
    </form>
  </div>
  
  <script>
    function updateCount() {
      const checked = document.querySelectorAll('.market-checkbox:checked').length;
      document.getElementById('selectedCount').textContent = checked;
      document.getElementById('submitBtn').disabled = checked === 0;
    }
    
    function selectAll() {
      document.querySelectorAll('.market-checkbox').forEach(cb => {
        if (cb.closest('.market-item').style.display !== 'none') {
          cb.checked = true;
        }
      });
      updateCount();
    }
    
    function deselectAll() {
      document.querySelectorAll('.market-checkbox').forEach(cb => cb.checked = false);
      updateCount();
    }
    
    function filterMarkets() {
      const search = document.getElementById('searchBox').value.toLowerCase();
      document.querySelectorAll('.market-item').forEach(item => {
        const market = item.getAttribute('data-market');
        item.style.display = market.includes(search) ? 'block' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

/**
 * HTML für die Datenseite mit Charts und Tabelle (Paradex-Style)
 */
function getDataPage(headers, data, stats, selectedMarkets) {
  // Bereite Chart-Daten für jeden Market vor
  const chartData = prepareChartData(data, selectedMarkets);
  
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lighter Funding Analytics</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>📊</text></svg>">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0e1a;
      color: #e2e8f0;
      padding: 20px;
      line-height: 1.6;
    }
    
    .container {
      max-width: 1600px;
      margin: 0 auto;
    }
    
    .header {
      padding: 30px 0;
      margin-bottom: 30px;
      border-bottom: 1px solid #1e293b;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 8px;
    }
    
    .header p {
      color: #64748b;
      font-size: 14px;
    }
    
    .back-btn {
      display: inline-block;
      padding: 10px 20px;
      background: #1e293b;
      color: #e2e8f0;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 15px;
      transition: all 0.3s ease;
      border: 1px solid #334155;
      font-size: 14px;
    }
    
    .back-btn:hover {
      background: #334155;
      border-color: #475569;
    }
    
    .markets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .market-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 24px;
      transition: all 0.3s ease;
    }
    
    .market-card:hover {
      border-color: #334155;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    
    .market-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .market-name {
      font-size: 20px;
      font-weight: 700;
      color: #f1f5f9;
    }
    
    .timeframe-selector {
      display: flex;
      gap: 4px;
      background: #1e293b;
      padding: 4px;
      border-radius: 8px;
    }
    
    .timeframe-btn {
      padding: 6px 12px;
      background: transparent;
      border: none;
      color: #64748b;
      cursor: pointer;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    
    .timeframe-btn:hover {
      color: #e2e8f0;
    }
    
    .timeframe-btn.active {
      background: #334155;
      color: #f1f5f9;
    }
    
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .stat-item {
      background: #1e293b;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #334155;
    }
    
    .stat-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-value {
      font-size: 18px;
      font-weight: 700;
      color: #f1f5f9;
    }
    
    .stat-value.positive {
      color: #10b981;
    }
    
    .stat-value.negative {
      color: #ef4444;
    }
    
    .chart-container {
      position: relative;
      height: 250px;
      margin-bottom: 16px;
    }
    
    .forecast-section {
      background: #1e293b;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #334155;
      margin-top: 16px;
    }
    
    .forecast-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 8px;
    }
    
    .forecast-value {
      font-size: 24px;
      font-weight: 700;
      color: #10b981;
    }
    
    .forecast-subtext {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }
    
    .table-container {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      overflow: hidden;
      margin-top: 40px;
    }
    
    .table-header {
      padding: 24px;
      border-bottom: 1px solid #1e293b;
    }
    
    .table-header h2 {
      font-size: 18px;
      font-weight: 700;
      color: #f1f5f9;
    }
    
    .table-controls {
      padding: 20px 24px;
      background: #0a0e1a;
      border-bottom: 1px solid #1e293b;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    
    .search-box, .filter-select {
      padding: 10px 14px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      color: #e2e8f0;
      font-size: 14px;
    }
    
    .search-box {
      flex: 1;
      min-width: 200px;
    }
    
    .search-box:focus, .filter-select:focus {
      outline: none;
      border-color: #475569;
    }
    
    .filter-select {
      cursor: pointer;
    }
    
    .filter-select option {
      background: #1e293b;
      color: #e2e8f0;
    }
    
    .table-wrapper {
      overflow-x: auto;
      max-height: 600px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    thead {
      position: sticky;
      top: 0;
      background: #0f172a;
      z-index: 10;
    }
    
    th {
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #64748b;
      border-bottom: 1px solid #1e293b;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
      position: relative;
      transition: color 0.2s ease;
    }
    
    th:hover {
      color: #e2e8f0;
    }
    
    th.sortable::after {
      content: '⇅';
      position: absolute;
      right: 8px;
      opacity: 0.3;
      font-size: 14px;
    }
    
    th.sort-asc::after {
      content: '↑';
      opacity: 1;
      color: #10b981;
    }
    
    th.sort-desc::after {
      content: '↓';
      opacity: 1;
      color: #10b981;
    }
    
    td {
      padding: 16px;
      border-bottom: 1px solid #1e293b;
      color: #e2e8f0;
      font-size: 14px;
    }
    
    tbody tr:hover {
      background: #1e293b;
    }
    
    .market-badge {
      display: inline-block;
      padding: 4px 10px;
      background: #1e293b;
      color: #10b981;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
      border: 1px solid #334155;
    }
    
    .side-long {
      color: #10b981;
      font-weight: 600;
    }
    
    .side-short {
      color: #ef4444;
      font-weight: 600;
    }
    
    .total-entries {
      color: #64748b;
      font-size: 14px;
      margin-left: auto;
    }
    
    .total-entries strong {
      color: #f1f5f9;
    }
    
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #1e293b;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #475569;
    }
    
    @media (max-width: 768px) {
      .markets-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-row {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Lighter Funding Analytics</h1>
      <p>Analyse von ${data.length.toLocaleString()} Transaktionen für ${selectedMarkets.length} Markets</p>
      <a href="/" class="back-btn">← Neue Analyse</a>
    </div>
    
    <div class="markets-grid" id="marketsGrid">
      ${selectedMarkets.map(market => `
        <div class="market-card" data-market="${market}">
          <div class="market-header">
            <div class="market-name">${market}</div>
            <div class="timeframe-selector">
              <button class="timeframe-btn active" onclick="changeTimeframe('${market}', '24h', event)">24H</button>
              <button class="timeframe-btn" onclick="changeTimeframe('${market}', '7d', event)">7D</button>
              <button class="timeframe-btn" onclick="changeTimeframe('${market}', '30d', event)">30D</button>
              <button class="timeframe-btn" onclick="changeTimeframe('${market}', 'all', event)">ALL</button>
            </div>
          </div>
          
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-label">Total Payment</div>
              <div class="stat-value">$${stats[market].totalPayment.toFixed(2)}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Avg Rate</div>
              <div class="stat-value">${parseFloat(stats[market].avgRate.toFixed(6))}%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Rate Range</div>
              <div class="stat-value" style="font-size: 14px;">${parseFloat(stats[market].minRate.toFixed(10))}% - ${parseFloat(stats[market].maxRate.toFixed(10))}%</div>
            </div>
          </div>
          
          <div class="chart-container">
            <canvas id="chart-${market}"></canvas>
          </div>
          
          <div class="forecast-section">
            <div class="forecast-label">Prognose bis ${new Date().getFullYear()}-12-31</div>
            <div class="forecast-value">$${stats[market].yearEndForecast.toFixed(2)}</div>
            <div class="forecast-subtext">Basierend auf aktueller Performance</div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="table-container">
      <div class="table-header">
        <h2>Detaillierte Transaktionsdaten</h2>
      </div>
      
      <div class="table-controls">
        <input type="text" class="search-box" id="searchBox" placeholder="Suchen..." onkeyup="filterTable()">
        <select class="filter-select" id="marketFilter" onchange="filterTable()">
          <option value="">Alle Coins</option>
          ${selectedMarkets.map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
        <select class="filter-select" id="sideFilter" onchange="filterTable()">
          <option value="">Alle Seiten</option>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
        <span class="total-entries">
          <strong id="visibleRows">${data.length}</strong> / ${data.length}
        </span>
      </div>
      
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="sortable" data-column="0" data-type="string" onclick="sortTable(0, 'string')">
                Coin
              </th>
              <th class="sortable" data-column="1" data-type="string" onclick="sortTable(1, 'string')">
                ${headers[1]}
              </th>
              <th class="sortable" data-column="2" data-type="date" onclick="sortTable(2, 'date')">
                ${headers[2]}
              </th>
              <th class="sortable" data-column="3" data-type="number" onclick="sortTable(3, 'number')">
                ${headers[3]}
              </th>
              <th class="sortable" data-column="4" data-type="number" onclick="sortTable(4, 'number')">
                ${headers[4]}
              </th>
              <th class="sortable" data-column="5" data-type="number" onclick="sortTable(5, 'number')">
                ${headers[5]}
              </th>
            </tr>
          </thead>
          <tbody id="tableBody">
            ${data.map(row => {
              const rate = parseFloat(row[5]?.replace('%', '')) * 100;
              const rateFormatted = parseFloat(rate.toFixed(10));
              return `
              <tr>
                <td><span class="market-badge">${row[0]}</span></td>
                <td><span class="side-${row[1]}">${row[1].toUpperCase()}</span></td>
                <td>${row[2]}</td>
                <td>${parseFloat(row[3]).toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                <td>$${parseFloat(row[4]).toFixed(6)}</td>
                <td>${rateFormatted}%</td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  <script>
    const chartData = ${JSON.stringify(chartData)};
    const charts = {};
    let currentSort = { column: -1, direction: 'asc' };
    
    // Store original data for sorting
    const tableData = ${JSON.stringify(data)};
    
    // Initialize all charts
    ${selectedMarkets.map(market => `
      initChart('${market}', '24h');
    `).join('\n')}
    
    function sortTable(columnIndex, dataType) {
      const tbody = document.getElementById('tableBody');
      const headers = document.querySelectorAll('th.sortable');
      
      // Determine sort direction
      let direction = 'asc';
      if (currentSort.column === columnIndex) {
        direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      }
      
      // Update header classes
      headers.forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
      });
      headers[columnIndex].classList.add(direction === 'asc' ? 'sort-asc' : 'sort-desc');
      
      // Get current visible rows data
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const visibleData = rows
        .filter(row => row.style.display !== 'none')
        .map(row => {
          const cells = row.querySelectorAll('td');
          return {
            element: row,
            data: tableData.find(d => 
              cells[0].textContent.trim() === d[0] && 
              cells[2].textContent === d[2]
            )
          };
        });
      
      // Sort the data
      visibleData.sort((a, b) => {
        let aVal = a.data[columnIndex];
        let bVal = b.data[columnIndex];
        
        // Parse values based on type
        if (dataType === 'number') {
          aVal = parseFloat(aVal.toString().replace(/[^0-9.-]/g, ''));
          bVal = parseFloat(bVal.toString().replace(/[^0-9.-]/g, ''));
        } else if (dataType === 'date') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        } else {
          aVal = aVal.toString().toLowerCase();
          bVal = bVal.toString().toLowerCase();
        }
        
        let comparison = 0;
        if (aVal > bVal) comparison = 1;
        if (aVal < bVal) comparison = -1;
        
        return direction === 'asc' ? comparison : -comparison;
      });
      
      // Reorder DOM elements
      visibleData.forEach(item => {
        tbody.appendChild(item.element);
      });
      
      // Update current sort state
      currentSort = { column: columnIndex, direction: direction };
    }
    
    function initChart(market, timeframe) {
      const ctx = document.getElementById('chart-' + market);
      if (!ctx) return;
      
      const data = getChartData(market, timeframe);
      
      if (charts[market]) {
        charts[market].destroy();
      }
      
      charts[market] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Rate (%)',
            data: data.values,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#10b981',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#1e293b',
              titleColor: '#f1f5f9',
              bodyColor: '#e2e8f0',
              borderColor: '#334155',
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return 'Rate: ' + parseFloat(context.parsed.y.toFixed(10)) + '%';
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false,
                drawBorder: false
              },
              ticks: {
                color: '#64748b',
                font: {
                  size: 11
                },
                maxRotation: 0
              }
            },
            y: {
              grid: {
                color: '#1e293b',
                drawBorder: false
              },
              ticks: {
                color: '#64748b',
                font: {
                  size: 11
                },
                callback: function(value) {
                  return parseFloat(value.toFixed(10)) + '%';
                }
              }
            }
          }
        }
      });
    }
    
    function getChartData(market, timeframe) {
      const data = chartData[market];
      if (!data) return { labels: [], values: [] };
      
      const now = new Date();
      let cutoffDate;
      
      switch(timeframe) {
        case '24h':
          cutoffDate = new Date(now - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          cutoffDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'all':
        default:
          cutoffDate = new Date(0);
      }
      
      const filtered = data.filter(d => new Date(d.date) >= cutoffDate);
      
      return {
        labels: filtered.map(d => {
          const date = new Date(d.date);
          if (timeframe === '24h') {
            return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
          } else {
            return date.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' });
          }
        }),
        values: filtered.map(d => d.rate)
      };
    }
    
    function changeTimeframe(market, timeframe, event) {
      // Update button states
      const card = document.querySelector(\`[data-market="\${market}"]\`);
      card.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');
      
      // Update chart
      initChart(market, timeframe);
    }
    
    function filterTable() {
      const searchValue = document.getElementById('searchBox').value.toLowerCase();
      const marketFilter = document.getElementById('marketFilter').value.toLowerCase();
      const sideFilter = document.getElementById('sideFilter').value.toLowerCase();
      
      const rows = document.querySelectorAll('#tableBody tr');
      let visibleCount = 0;
      
      rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const market = cells[0].textContent.toLowerCase();
        const side = cells[1].textContent.toLowerCase();
        const text = row.textContent.toLowerCase();
        
        const matchesSearch = text.includes(searchValue);
        const matchesMarket = !marketFilter || market.includes(marketFilter);
        const matchesSide = !sideFilter || side.includes(sideFilter);
        
        if (matchesSearch && matchesMarket && matchesSide) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });
      
      document.getElementById('visibleRows').textContent = visibleCount;
      
      // Reset sort when filtering
      const headers = document.querySelectorAll('th.sortable');
      headers.forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
      });
      currentSort = { column: -1, direction: 'asc' };
    }
  </script>
</body>
</html>`;
}

/**
 * Bereitet Chart-Daten für jeden Market vor
 */
function prepareChartData(data, selectedMarkets) {
  const chartData = {};
  
  selectedMarkets.forEach(market => {
    const marketData = data
      .filter(row => row[0] === market)
      .map(row => ({
        date: row[2],
        // Rate aus CSV mit 100 multiplizieren für korrekte Darstellung
        rate: (parseFloat(row[5]?.replace('%', '')) || 0) * 100
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    chartData[market] = marketData;
  });
  
  return chartData;
}

/**
 * Hilfsfunktion zum Escapen von HTML
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}