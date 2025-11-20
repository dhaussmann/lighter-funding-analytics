# Lighter Funding Export Viewer - Cloudflare Worker

Ein moderner Cloudflare Worker zur Visualisierung und Analyse von Lighter Funding Export CSV-Daten.

## 🚀 Features

- **CSV Upload**: Einfaches Hochladen von CSV-Dateien per Drag & Drop oder Dateiauswahl
- **Coin-Auswahl**: Interaktive Auswahl der gewünschten Markets/Coins
- **Interaktive Charts**: Live-Charts für jeden Market mit Rate-Verlauf
- **Zeitraum-Auswahl**: Ansicht für 24h, 7 Tage, 30 Tage und All Time
- **Jahresprognose**: Automatische Berechnung der erwarteten Payments bis Jahresende
- **Statistiken**: Übersichtliche Darstellung von Total Payment, Average Rate und Range
- **Detaillierte Tabelle**: Durchsuchbare und filterbare Tabelle aller Transaktionen
- **Paradex-Style Design**: Dunkles, modernes Design inspiriert von Paradex
- **Vollständig Serverless**: Läuft komplett auf Cloudflare's Edge-Netzwerk

## 📋 Voraussetzungen

- Ein Cloudflare-Account (kostenlos)
- Node.js und npm installiert (für die Entwicklung)
- Wrangler CLI (Cloudflare's CLI-Tool)

## 🛠️ Installation

### Schritt 1: Wrangler CLI installieren

```bash
npm install -g wrangler
```

### Schritt 2: Bei Cloudflare anmelden

```bash
wrangler login
```

### Schritt 3: Projekt erstellen

```bash
mkdir lighter-funding-viewer
cd lighter-funding-viewer
```

### Schritt 4: Worker-Datei erstellen

Kopiere den Inhalt der `cloudflare-worker.js` in eine neue Datei namens `index.js`:

```bash
# Erstelle die Datei
touch index.js
```

### Schritt 5: wrangler.toml konfigurieren

Erstelle eine `wrangler.toml` Datei mit folgendem Inhalt:

```toml
name = "lighter-funding-viewer"
main = "index.js"
compatibility_date = "2024-11-20"

[vars]
# Optional: Umgebungsvariablen hier definieren
```

### Schritt 6: Worker deployen

```bash
wrangler deploy
```

Nach erfolgreichem Deploy erhältst du eine URL wie:
`https://lighter-funding-viewer.DEIN-SUBDOMAIN.workers.dev`

## 📱 Verwendung

### 1. CSV-Datei hochladen
- Öffne die Worker-URL in deinem Browser
- Lade deine Lighter Funding Export CSV-Datei hoch (Drag & Drop oder Dateiauswahl)

### 2. Coins auswählen
- Wähle die gewünschten Markets/Coins aus der Liste aus
- Nutze die Suchfunktion, um schnell bestimmte Coins zu finden
- Buttons "Alle auswählen" oder "Alle abwählen" für schnelle Auswahl

### 3. Daten analysieren
- Betrachte die individuellen Market Cards mit:
  - **Interaktiven Charts**: Zeige Rate-Verläufe über verschiedene Zeiträume (24H, 7D, 30D, ALL)
  - **Statistiken**: Total Payment, Average Rate, Min/Max Rates
  - **Jahresprognose**: Automatisch berechnete erwartete Payments bis 31.12.
- Nutze die Filter und Suchfunktion in der detaillierten Transaktionstabelle

## 🎨 Features im Detail

### Upload-Seite
- Moderne Drag & Drop-Oberfläche
- Dateivalidierung
- Visuelle Bestätigung des Uploads

### Auswahl-Seite
- Grid-Layout für alle verfügbaren Markets
- Echtzeit-Suchfunktion
- Zähler für ausgewählte Markets
- Visuelle Hervorhebung ausgewählter Coins

### Daten-Seite
- **Market Cards**: Individuelle Cards für jeden ausgewählten Market mit:
  - Interaktivem Line-Chart mit Chart.js
  - Zeitraum-Auswahl (24H, 7D, 30D, ALL)
  - Total Payment Statistik
  - Average Rate und Rate Range
  - Automatische Jahresprognose basierend auf aktueller Performance
- **Charts**: 
  - Smooth Line-Charts mit Hover-Tooltips
  - Responsive und performant
  - Automatische Zeitachsen-Formatierung
  - Grüne Farbgebung (#10b981)
- **Filterbare Tabelle**: 
  - Textsuche über alle Spalten
  - Filter nach Market
  - Filter nach Side (Long/Short)
  - Live-Anzeige der gefilterten Einträge
- **Paradex-Style**: Dunkles Design (#0a0e1a Hintergrund, #0f172a Cards)
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Sticky Header**: Spaltenüberschriften bleiben beim Scrollen sichtbar

## 🔧 Anpassungen

### Farben ändern
Die Farbpalette ist im CSS definiert. Hauptfarben:
- Primary: `#667eea` (Lila-Blau)
- Secondary: `#764ba2` (Lila)

### Statistiken erweitern
In der `calculateStats()`-Funktion können weitere Berechnungen hinzugefügt werden.

### Tabellenspalten
Die Spalten werden automatisch aus der CSV-Datei gelesen. Die Reihenfolge entspricht der CSV-Struktur:
1. Market
2. Side
3. Date
4. Position Size
5. Payment
6. Rate

## 🔒 Sicherheit

- Der Worker speichert keine Daten dauerhaft
- Alle Daten werden nur während der Session verarbeitet
- CSV-Daten werden als Form-Data übertragen
- Kein externes Tracking oder Analytics

## 🐛 Fehlerbehebung

### Worker deployed nicht
```bash
# Überprüfe deine Authentifizierung
wrangler whoami

# Neu anmelden wenn nötig
wrangler logout
wrangler login
```

### CSV wird nicht verarbeitet
- Stelle sicher, dass die CSV das richtige Format hat (Komma-getrennt)
- Erste Zeile muss die Header enthalten
- Encoding sollte UTF-8 sein

### Tabelle zeigt keine Daten
- Überprüfe, ob mindestens ein Market ausgewählt wurde
- Kontrolliere die Browser-Konsole auf JavaScript-Fehler

## 📊 CSV-Format

Die CSV-Datei muss folgende Spalten enthalten:
```
Market,Side,Date,Position Size,Payment,Rate
```

Beispiel:
```csv
Market,Side,Date,Position Size,Payment,Rate
BTC,short,2025-11-20 13:00:00,100.0,0.092040,0.000060%
ETH,long,2025-11-20 12:00:00,50.0,0.097375,0.000063%
```

## 🚀 Weitere Entwicklung

Mögliche Erweiterungen:
- Export der gefilterten Daten als CSV
- Zusätzliche Chart-Typen (Candlestick, Bar Charts)
- Vergleichsansicht mehrerer Markets in einem Chart
- Speicherung von Filter-Präferenzen
- Email-Benachrichtigungen bei Rate-Änderungen
- Historische Prognose-Genauigkeit
- API-Endpunkte für externe Tools

## 📝 Lizenz

Dieses Projekt steht zur freien Verfügung.

## 🤝 Support

Bei Fragen oder Problemen:
1. Überprüfe die Cloudflare Worker Logs: `wrangler tail`
2. Kontrolliere die Browser-Konsole auf Fehler
3. Stelle sicher, dass die CSV dem erwarteten Format entspricht

## 📚 Ressourcen

- [Cloudflare Workers Dokumentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Dokumentation](https://developers.cloudflare.com/workers/wrangler/)
- [CSV Format Spezifikation](https://tools.ietf.org/html/rfc4180)
