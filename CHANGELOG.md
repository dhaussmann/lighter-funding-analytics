# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

## [2.0.0] - 2025-11-20

### ✨ Neue Features
- **Interaktive Charts**: Jeder Market hat jetzt einen Line-Chart mit Rate-Verlauf
- **Zeitraum-Auswahl**: 4 Zeiträume wählbar (24H, 7D, 30D, ALL)
- **Jahresprognose**: Automatische Berechnung der erwarteten Payments bis 31.12.
- **Paradex-Style Design**: Komplett neues dunkles Design inspiriert von Paradex
- **Chart.js Integration**: Professionelle Charts mit Hover-Tooltips

### 🎨 Design-Änderungen
- Dunkles Farbschema (#0a0e1a Hintergrund)
- Grüne Akzentfarbe (#10b981) statt Lila
- Modernere Card-Designs mit besseren Borders
- Optimierte Typografie und Spacing
- Verbesserte Hover-Effekte

### 🔧 Verbesserungen
- Entfernung der "Anzahl Einträge" aus Market-Statistiken
- Bessere Prognose-Berechnung basierend auf historischen Daten
- Optimierte Chart-Performance
- Verbesserte Responsive-Darstellung
- Custom Scrollbars im dunklen Design

### 📊 Statistiken
- Total Payment (unverändert)
- Average Rate (unverändert)
- Rate Range (Min-Max kombiniert)
- **NEU**: Jahresprognose mit Berechnungsgrundlage

### 🐛 Bugfixes
- Keine bekannten Bugs in dieser Version

---

## [1.0.0] - 2025-11-19

### ✨ Initiale Features
- CSV-Upload mit Drag & Drop
- Market-Auswahl mit Suche
- Statistik-Cards pro Market
- Filterbare Datentabelle
- Responsive Design
- Cloudflare Workers Deployment

### 📊 Statistiken
- Total Payment
- Average Rate
- Min/Max Rates
- Anzahl der Einträge

### 🎨 Design
- Helles Design mit Lila-Gradient
- Bootstrap-inspiriertes Layout
- Moderne Card-Designs

---

## Geplante Features

### [2.1.0] - In Entwicklung
- [ ] Export von gefilterten Daten als CSV
- [ ] Vergleichsansicht mehrerer Markets in einem Chart
- [ ] Speicherung von Benutzer-Präferenzen
- [ ] Verbesserte Prognose mit Trend-Analyse

### [3.0.0] - Future
- [ ] Candlestick-Charts
- [ ] Email-Benachrichtigungen
- [ ] API-Endpunkte
- [ ] Historische Prognose-Genauigkeit
- [ ] Multi-Language Support

---

## Upgrade-Guide

### Von 1.0.0 zu 2.0.0

#### Breaking Changes
- Keine Breaking Changes - alle Features sind abwärtskompatibel
- CSV-Format bleibt identisch

#### Neue Abhängigkeiten
- Chart.js 4.4.0 wird über CDN geladen (keine Installation nötig)

#### Design-Migration
- Automatisch - kein Eingreifen nötig
- Alle Farben wurden intern angepasst

#### Neue Funktionen nutzen
1. **Charts**: Werden automatisch für alle Markets generiert
2. **Zeitraum-Wechsel**: Einfach auf die Buttons (24H, 7D, etc.) klicken
3. **Prognose**: Wird automatisch basierend auf Daten berechnet

---

## Version-Nummern

Dieses Projekt folgt [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking Changes
- **MINOR** (1.X.0): Neue Features (abwärtskompatibel)
- **PATCH** (1.0.X): Bugfixes (abwärtskompatibel)

---

## Feedback & Contributions

Für Feedback, Bug-Reports oder Feature-Requests:
- Nutze die GitHub Issues
- Oder kontaktiere das Development-Team

Vielen Dank für die Nutzung von Lighter Funding Analytics! 🚀
