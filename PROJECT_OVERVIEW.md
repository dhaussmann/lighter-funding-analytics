# 📦 Lighter Funding Viewer - Projektübersicht

## 📁 Dateien im Projekt

### Hauptdateien

#### `cloudflare-worker.js` / `index.js`
Die Haupt-Worker-Datei mit dem kompletten Code für:
- CSV-Upload Handling
- Coin/Market-Auswahl
- Statistik-Berechnungen
- Datenvisualisierung
- Alle drei Seiten (Upload, Auswahl, Anzeige)

**Verwendung:** Benenne diese Datei in `index.js` um für das Deployment

#### `wrangler.toml`
Konfigurationsdatei für Cloudflare Workers:
- Worker-Name
- Compatibility Date
- Umgebungsvariablen (optional)
- Development/Production Environments

#### `package.json`
npm-Konfiguration mit Scripts:
- `npm run dev` - Lokaler Development Server
- `npm run deploy` - Deployment zu Cloudflare
- `npm run tail` - Live-Logs anzeigen

#### `.gitignore`
Definiert Dateien/Ordner, die nicht ins Git-Repository sollen

---

## 📖 Dokumentation

#### `README.md`
Vollständige Dokumentation mit:
- Feature-Liste
- Detaillierte Installationsanleitung
- Verwendungsbeispiele
- Troubleshooting
- Anpassungsmöglichkeiten

#### `QUICKSTART.md`
Schnellstart-Anleitung in 5 Minuten:
- Minimale Schritte zum Deployment
- Wichtigste Befehle
- Häufige Probleme

---

## 🚀 Deployment-Schritte

### Option 1: Schnellstart (empfohlen)
```bash
# 1. Wrangler installieren
npm install -g wrangler

# 2. Anmelden
wrangler login

# 3. In Projektordner wechseln
cd lighter-funding-viewer

# 4. cloudflare-worker.js umbenennen
mv cloudflare-worker.js index.js

# 5. Deployen
wrangler deploy
```

### Option 2: Mit npm
```bash
# 1. Dependencies installieren
npm install

# 2. cloudflare-worker.js umbenennen
mv cloudflare-worker.js index.js

# 3. Deployen
npm run deploy
```

---

## 🎨 Features des Workers

### Seite 1: Upload
- Paradex-inspiriertes dunkles Design (#0a0e1a)
- Moderne Drag & Drop Oberfläche
- CSV-Validierung
- Responsive Design

### Seite 2: Coin-Auswahl
- Dunkles Grid-Layout aller Markets
- Echtzeit-Suche mit grünem Highlight (#10b981)
- "Alle auswählen/abwählen" Buttons
- Zähler für ausgewählte Coins
- Smooth Hover-Effekte

### Seite 3: Daten-Anzeige
- **Market Cards**: Individuelle Cards pro Market mit:
  - Interaktiven Line-Charts (Chart.js)
  - Zeitraum-Buttons: 24H, 7D, 30D, ALL
  - Total Payment Anzeige
  - Average Rate und Rate Range
  - **Jahresprognose**: Automatische Berechnung bis 31.12.
  
- **Interaktive Charts**:
  - Smooth Line-Charts mit grüner Farbgebung
  - Hover-Tooltips mit detaillierten Informationen
  - Responsive und performant
  - Automatische Datums-Formatierung je nach Zeitraum
  
- **Interaktive Tabelle**:
  - Sticky Header (bleibt beim Scrollen sichtbar)
  - Textsuche über alle Spalten
  - Filter nach Market
  - Filter nach Side (Long/Short)
  - Live-Zähler der angezeigten Zeilen
  - Hover-Effekte mit dunklem Hintergrund
  - Farbcodierung (Long grün #10b981, Short rot #ef4444)

---

## 🎯 Technische Details

### Technologie-Stack
- **Runtime**: Cloudflare Workers (V8 Isolates)
- **Language**: JavaScript (ES6+)
- **Frontend**: Pure HTML5, CSS3, Vanilla JS
- **Charts**: Chart.js 4.4.0 (via CDN)
- **Design**: Paradex-inspiriert, dunkles Theme
- **Datenspeicherung**: Keine (alles im RAM während Session)

### Design-Farben
- **Hintergrund**: #0a0e1a (Dunkelblau-Schwarz)
- **Cards**: #0f172a (Dunkles Blau)
- **Borders**: #1e293b, #334155 (Grau-Töne)
- **Primary**: #10b981 (Grün - für positive Werte, Long)
- **Danger**: #ef4444 (Rot - für Short)
- **Text Primary**: #f1f5f9 (Hell)
- **Text Secondary**: #64748b (Grau)

### Performance
- **Ladezeit**: < 100ms (Edge-Netzwerk)
- **CSV-Verarbeitung**: Client-side + Server-side
- **Max. File Size**: ~10MB (Browser-abhängig)

### Sicherheit
- ✅ Keine Daten-Speicherung
- ✅ Keine externen Dependencies
- ✅ XSS-Protection durch HTML-Escaping
- ✅ HTTPS-Only

---

## 🔧 Anpassungsmöglichkeiten

### Design anpassen
Alle Farben und Styles sind in den `<style>`-Tags definiert:
- **Primary Color**: `#667eea` (Lila-Blau)
- **Secondary Color**: `#764ba2` (Lila)
- **Success**: `#10b981` (Grün)
- **Error**: `#ef4444` (Rot)

### Statistiken erweitern
In der `calculateStats()` Funktion weitere Berechnungen hinzufügen:
```javascript
stats[market].newMetric = // deine Berechnung
```

### Neue Filter hinzufügen
In `getDataPage()` weitere Filter-Selects hinzufügen

---

## 💡 Verwendungsbeispiele

### Use Case 1: Tägliche Analyse
Upload der täglich exportierten CSV → Schneller Überblick über alle Markets

### Use Case 2: Market-Vergleich
Auswahl mehrerer ähnlicher Markets → Vergleich der Rates und Payments

### Use Case 3: Historische Daten
Upload älterer CSV-Dateien → Analyse von Trends über Zeit

---

## 📊 CSV-Format

```csv
Market,Side,Date,Position Size,Payment,Rate
BTC,short,2025-11-20 13:00:00,12502.0,0.092040,0.000060%
ETH,long,2025-11-20 12:00:00,47.53,0.022377,0.000012%
```

**Erforderliche Spalten:**
1. Market (String)
2. Side (long/short)
3. Date (YYYY-MM-DD HH:MM:SS)
4. Position Size (Number)
5. Payment (Number)
6. Rate (Number mit %)

---

## 🌐 Cloudflare Limits (Free Tier)

- ✅ 100.000 Requests/Tag
- ✅ 10ms CPU-Zeit/Request
- ✅ Unbegrenzte Bandbreite
- ✅ Global Edge-Netzwerk

**→ Perfekt für persönliche Nutzung!**

---

## 📞 Support-Optionen

1. **Logs checken**: `wrangler tail`
2. **Browser-Konsole**: F12 → Console-Tab
3. **Wrangler Docs**: https://developers.cloudflare.com/workers/
4. **CSV-Format prüfen**: Erste Zeile = Header

---

## 🎉 Los geht's!

1. Benenne `cloudflare-worker.js` → `index.js` um
2. Deploy mit `wrangler deploy`
3. Öffne die erhaltene URL
4. Upload deine CSV
5. Analysiere deine Daten!

**Viel Erfolg!** 🚀
