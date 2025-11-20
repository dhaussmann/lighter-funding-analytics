# 🚀 Quick Start Guide

## Schnellstart in 5 Minuten

### 1. Wrangler installieren
```bash
npm install -g wrangler
```

### 2. Bei Cloudflare anmelden
```bash
wrangler login
```
Ein Browser-Fenster öffnet sich - melde dich mit deinem Cloudflare-Account an.

### 3. Projekt-Dateien vorbereiten
```bash
# Erstelle ein neues Verzeichnis
mkdir lighter-funding-viewer
cd lighter-funding-viewer

# Erstelle die Hauptdatei
touch index.js
```

Kopiere den Inhalt aus `cloudflare-worker.js` in die `index.js` Datei.

### 4. Wrangler konfigurieren
Erstelle eine `wrangler.toml` Datei:

```toml
name = "lighter-funding-viewer"
main = "index.js"
compatibility_date = "2024-11-20"
```

### 5. Deploy!
```bash
wrangler deploy
```

✅ Fertig! Du erhältst eine URL wie: `https://lighter-funding-viewer.DEIN-NAME.workers.dev`

---

## Verwendung

1. **Öffne die Worker-URL** in deinem Browser
2. **Lade deine CSV-Datei** hoch (Drag & Drop oder Klicken)
3. **Wähle die Coins** aus, die du analysieren möchtest
4. **Betrachte die Statistiken** und durchsuche die Tabelle

---

## Nützliche Befehle

### Lokal testen (Development Server)
```bash
wrangler dev
```
Öffnet einen lokalen Server auf `http://localhost:8787`

### Logs anzeigen
```bash
wrangler tail
```
Zeigt Live-Logs deines Workers an

### Worker löschen
```bash
wrangler delete
```

---

## Projektstruktur

```
lighter-funding-viewer/
├── index.js          # Haupt-Worker-Code
├── wrangler.toml     # Cloudflare-Konfiguration
├── package.json      # npm-Konfiguration
└── README.md         # Ausführliche Dokumentation
```

---

## Troubleshooting

### "Command not found: wrangler"
```bash
# Wrangler neu installieren
npm install -g wrangler

# Oder mit npx verwenden
npx wrangler deploy
```

### "Authentication error"
```bash
# Neu anmelden
wrangler logout
wrangler login
```

### CSV wird nicht verarbeitet
- Stelle sicher, dass die CSV UTF-8 encoded ist
- Erste Zeile muss Header sein: `Market,Side,Date,Position Size,Payment,Rate`
- Verwende Kommata als Trennzeichen

---

## Features auf einen Blick

✅ Drag & Drop CSV Upload  
✅ Market-Auswahl mit Suche  
✅ **Interaktive Charts mit Chart.js**  
✅ **Zeitraum-Auswahl (24H, 7D, 30D, ALL)**  
✅ **Automatische Jahresprognose**  
✅ Statistiken pro Market  
✅ Filterbare Datentabelle  
✅ **Paradex-Style dunkles Design**  
✅ Responsive Design  
✅ Keine Datenspeicherung  
✅ Komplett kostenlos (Cloudflare Free Tier)  

---

## Kosten

Der Cloudflare Workers Free Tier bietet:
- 100.000 Requests pro Tag
- 10ms CPU-Zeit pro Request
- **Völlig ausreichend für persönliche Nutzung!**

---

## Support & Feedback

Bei Problemen:
1. Überprüfe `wrangler tail` für Logs
2. Schaue in die Browser-Konsole (F12)
3. Kontrolliere das CSV-Format

Viel Erfolg! 🎉
