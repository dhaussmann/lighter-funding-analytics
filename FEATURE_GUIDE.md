# 📖 Feature Guide - Lighter Funding Analytics

## Übersicht der Hauptfunktionen

### 1. 📊 Interaktive Charts

Jeder ausgewählte Market erhält einen eigenen interaktiven Line-Chart, der den Verlauf der Funding Rate visualisiert.

#### Chart-Features:
- **Smooth Line**: Weiche Kurvenverläufe mit Tension 0.4
- **Hover-Tooltips**: Zeige genaue Rate-Werte beim Überfahren
- **Fill-Gradient**: Halbtransparente Füllung unter der Linie
- **Responsive**: Passt sich automatisch an Bildschirmgröße an
- **Performance**: Optimiert für große Datenmengen

#### Farben:
- Line Color: `#10b981` (Grün)
- Fill Color: `rgba(16, 185, 129, 0.1)` (Transparentes Grün)
- Hover Points: Weiße Border mit grünem Zentrum

---

### 2. ⏱️ Zeitraum-Auswahl

Wechsle zwischen verschiedenen Zeiträumen, um unterschiedliche Perspectives zu erhalten.

#### Verfügbare Zeiträume:

**24H (24 Stunden)**
- Zeigt die letzten 24 Stunden
- X-Achse: Uhrzeiten (HH:MM Format)
- Ideal für: Tagestrading, kurzfristige Trends
- Use Case: "Wie hat sich die Rate heute entwickelt?"

**7D (7 Tage)**
- Zeigt die letzte Woche
- X-Achse: Datumsangaben (z.B. "Nov 14")
- Ideal für: Wochentrends, mittelfristige Analyse
- Use Case: "Gibt es wöchentliche Muster?"

**30D (30 Tage)**
- Zeigt den letzten Monat
- X-Achse: Datumsangaben
- Ideal für: Monatliche Trends, längerfristige Entwicklung
- Use Case: "Wie stabil ist die Rate über einen Monat?"

**ALL (Alle Daten)**
- Zeigt den kompletten Datensatz
- X-Achse: Datumsangaben vom Start bis Ende
- Ideal für: Historische Analyse, Gesamtübersicht
- Use Case: "Was ist der langfristige Trend?"

#### Bedienung:
1. Klicke auf einen der vier Buttons (24H, 7D, 30D, ALL)
2. Der Chart aktualisiert sich sofort
3. Der aktive Zeitraum wird hervorgehoben (dunkler Hintergrund)

---

### 3. 💰 Jahresprognose

Für jeden Market wird automatisch eine Prognose bis zum 31. Dezember des aktuellen Jahres berechnet.

#### Berechnungsmethode:
```
1. Berechne Zeitspanne der vorhandenen Daten (firstDate bis lastDate)
2. Berechne durchschnittliches Payment pro Tag:
   avgPaymentPerDay = totalPayment / daysSinceStart
3. Berechne verbleibende Tage bis 31.12.:
   daysToYearEnd = (31.12.YYYY - heute)
4. Prognose = totalPayment + (avgPaymentPerDay * daysToYearEnd)
```

#### Anzeige:
- **Forecast Value**: Großer, grüner Wert ($XXX.XX)
- **Label**: "Prognose bis YYYY-12-31"
- **Subtext**: "Basierend auf aktueller Performance"

#### Interpretation:
- ✅ **Hohe Prognose**: Market generiert konstante Payments
- ⚠️ **Niedrige Prognose**: Wenig historische Daten oder niedrige Rates
- 📊 **Genauigkeit**: Steigt mit längerer Datenhistorie

#### Beispiel:
```
Aktuelle Total Payment: $150.00
Daten von: 01.11. bis 20.11. (20 Tage)
Durchschnitt/Tag: $7.50
Verbleibende Tage: 41
Prognose: $150 + ($7.50 * 41) = $457.50
```

---

### 4. 📈 Statistiken pro Market

Jede Market-Card zeigt drei wichtige Kennzahlen:

#### Total Payment
- **Was**: Summe aller Payments für diesen Market
- **Format**: Dollar mit 4 Dezimalstellen ($X.XXXX)
- **Verwendung**: Gesamtertrag verstehen

#### Average Rate
- **Was**: Durchschnittliche Funding Rate über alle Einträge
- **Format**: Prozent mit 6 Dezimalstellen (X.XXXXXX%)
- **Verwendung**: Typische Rate für diesen Market einschätzen

#### Rate Range
- **Was**: Minimum und Maximum der beobachteten Rates
- **Format**: "Min% - Max%"
- **Verwendung**: Volatilität und Extremwerte erkennen

---

### 5. 🔍 Tabellen-Filter

Die detaillierte Transaktionstabelle bietet drei Filtermöglichkeiten:

#### Textsuche
- Durchsucht **alle Spalten** gleichzeitig
- Case-insensitive (Groß-/Kleinschreibung egal)
- Echtzeit-Filterung während der Eingabe
- Beispiele:
  - `"BTC"` → Zeigt alle Bitcoin-Transaktionen
  - `"short"` → Zeigt alle Short-Positionen
  - `"2025-11-20"` → Zeigt alle Transaktionen vom 20.11.

#### Market-Filter
- Dropdown mit allen ausgewählten Markets
- Zeigt nur Transaktionen für den gewählten Market
- "Alle Markets" für keine Filterung

#### Side-Filter
- Dropdown mit Long/Short Optionen
- Filtert nach Position-Richtung
- Nützlich für separate Long/Short-Analyse

#### Kombination:
Alle Filter können **gleichzeitig** verwendet werden:
```
Textsuche: "2025-11-19"
Market: BTC
Side: short
→ Zeigt nur BTC-Short-Positionen vom 19.11.
```

---

### 6. 🎨 Design-Elemente

#### Farbsystem:
```css
Hintergründe:
- Page Background: #0a0e1a (sehr dunkel)
- Card Background: #0f172a (dunkelblau)
- Elevated Elements: #1e293b (etwas heller)

Borders & Lines:
- Primary Borders: #1e293b
- Secondary Borders: #334155
- Hover Borders: #475569

Text:
- Primary Text: #f1f5f9 (fast weiß)
- Secondary Text: #e2e8f0 (hellgrau)
- Muted Text: #64748b (grau)

Accent Colors:
- Success/Long: #10b981 (grün)
- Danger/Short: #ef4444 (rot)
```

#### Typografie:
- **Font Family**: 'Inter', System-Fonts
- **Headers**: 700 Font-Weight (Bold)
- **Body**: 400-600 Font-Weight
- **Uppercase Labels**: 12px mit letter-spacing

#### Spacing:
- Cards: 24px Padding
- Gaps: 12-20px zwischen Elementen
- Border-Radius: 8-12px für moderne Optik

---

### 7. 📱 Responsive Verhalten

#### Desktop (> 768px):
- Market-Cards: 2 Spalten Grid
- Stats: 3 Spalten Grid
- Tabelle: Volle Breite mit horizontalem Scroll bei Bedarf

#### Mobile (≤ 768px):
- Market-Cards: 1 Spalte
- Stats: 1 Spalte (gestapelt)
- Tabelle: Horizontales Scrollen

---

### 8. ⚡ Performance-Tipps

#### Große Datenmengen:
- Charts rendern nur sichtbare Datenpunkte
- Tabelle nutzt Virtual Scrolling
- Filter arbeiten effizient mit DOM-Manipulation

#### Empfohlene Limits:
- Markets: Bis zu 20 gleichzeitig (Performance bleibt gut)
- Datenpunkte: Bis zu 10.000 pro Market
- Tabellen-Einträge: Unbegrenzt (Scrollen möglich)

#### Browser-Kompatibilität:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

### 9. 🚀 Workflow-Beispiele

#### Szenario 1: Tägliche Analyse
```
1. Upload der täglichen CSV
2. Wähle deine Top 5 Markets
3. Setze Zeitraum auf "24H"
4. Überprüfe ungewöhnliche Rate-Spikes
5. Nutze Tabellen-Filter für Details
```

#### Szenario 2: Wöchentlicher Report
```
1. Upload der Wochen-CSV
2. Wähle alle aktiven Markets
3. Setze Zeitraum auf "7D"
4. Notiere Jahresprognosen
5. Exportiere Daten (Feature coming soon)
```

#### Szenario 3: Market-Vergleich
```
1. Upload der Daten
2. Wähle ähnliche Markets (z.B. alle Layer-1s)
3. Vergleiche Charts visuell
4. Analysiere Rate Ranges
5. Identifiziere stabilsten Market
```

---

### 10. 💡 Tipps & Tricks

#### Chart-Interaktion:
- **Hover**: Zeigt exakte Werte
- **Zoom**: Wähle kürzeren Zeitraum für Details
- **Vergleichen**: Öffne mehrere Browser-Tabs

#### Prognose verstehen:
- Mehr Daten = Genauere Prognose
- Stabile Rates = Verlässlichere Prognose
- Große Schwankungen = Vorsicht bei Interpretation

#### Filter kombinieren:
- Start broad, dann narrow down
- Nutze Textsuche für schnelle Navigation
- Side-Filter für Strategy-Testing

#### Performance:
- Wähle nur benötigte Markets
- Nutze Zeitraum-Filter statt ALL bei großen Datensets
- Leere Browser-Cache bei Problemen

---

## Keyboard Shortcuts

| Taste | Aktion |
|-------|--------|
| `/` | Fokus auf Suchfeld |
| `Esc` | Suchfeld leeren |
| `↑` `↓` | Tabelle navigieren |
| `Ctrl/Cmd + F` | Browser-Suche (zusätzlich) |

---

## Support & Fragen

Bei Fragen zu Features:
1. Prüfe diese Dokumentation
2. Schaue in die README.md
3. Kontaktiere Support

Viel Erfolg mit Lighter Funding Analytics! 📊
