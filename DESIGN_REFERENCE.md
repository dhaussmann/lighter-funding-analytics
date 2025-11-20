# 🎨 Design Reference - Lighter Funding Analytics

## Color Palette (Paradex-Inspired)

### Background Colors
```css
--bg-primary: #0a0e1a;      /* Haupthintergrund - sehr dunkles Blau-Schwarz */
--bg-secondary: #0f172a;    /* Cards & Container - dunkles Blau */
--bg-tertiary: #1e293b;     /* Elevated Elements - mittleres Dunkel */
--bg-hover: #334155;        /* Hover States - helleres Dunkel */
```

### Border Colors
```css
--border-primary: #1e293b;   /* Standard Borders */
--border-secondary: #334155; /* Emphasized Borders */
--border-hover: #475569;     /* Hover Borders */
```

### Text Colors
```css
--text-primary: #f1f5f9;     /* Headlines, wichtiger Text */
--text-secondary: #e2e8f0;   /* Standard Text */
--text-muted: #64748b;       /* Labels, Subtexte */
```

### Accent Colors
```css
--color-success: #10b981;    /* Grün - Long Positions, Charts, Success */
--color-danger: #ef4444;     /* Rot - Short Positions, Warnings */
--color-warning: #f59e0b;    /* Gelb/Orange - Alerts */
--color-info: #3b82f6;       /* Blau - Information */
```

### Chart-Specific Colors
```css
--chart-line: #10b981;                    /* Chart-Linie */
--chart-fill: rgba(16, 185, 129, 0.1);   /* Chart-Füllung */
--chart-grid: #1e293b;                   /* Grid-Linien */
--chart-text: #64748b;                   /* Achsen-Text */
```

---

## Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes
```css
--text-xs: 11px;     /* Chart Labels */
--text-sm: 12px;     /* Small Labels, Uppercase Headers */
--text-base: 13px;   /* Buttons, Small Text */
--text-md: 14px;     /* Standard Text, Table */
--text-lg: 15px;     /* Buttons Primary */
--text-xl: 16px;     /* Upload Text */
--text-2xl: 18px;    /* Table Headers, Stats */
--text-3xl: 20px;    /* Market Names, Section Headers */
--text-4xl: 24px;    /* Forecast Values */
--text-5xl: 28px;    /* Page Titles */
```

### Font Weights
```css
--font-normal: 400;   /* Body Text */
--font-medium: 500;   /* Emphasized Text */
--font-semibold: 600; /* Buttons, Labels */
--font-bold: 700;     /* Headlines, Important Values */
```

### Letter Spacing
```css
--tracking-normal: 0;
--tracking-wide: 0.5px;   /* Uppercase Labels */
```

---

## Spacing Scale

### Padding
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Gaps
```css
--gap-sm: 4px;      /* Timeframe Buttons */
--gap-md: 12px;     /* Grid Gaps */
--gap-lg: 16px;     /* Stats Row */
--gap-xl: 20px;     /* Markets Grid */
```

---

## Border Radius

```css
--radius-sm: 6px;    /* Badges, Small Elements */
--radius-md: 8px;    /* Buttons, Inputs */
--radius-lg: 10px;   /* Cards Inner Elements */
--radius-xl: 12px;   /* Main Cards */
--radius-2xl: 16px;  /* Large Containers */
--radius-full: 9999px; /* Pills, Badges */
```

---

## Shadows

```css
/* Small Shadow - Subtle Elevation */
--shadow-sm: 0 2px 10px rgba(0, 0, 0, 0.1);

/* Medium Shadow - Cards on Hover */
--shadow-md: 0 8px 24px rgba(0, 0, 0, 0.3);

/* Large Shadow - Main Containers */
--shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.5);
```

---

## Components

### Button Styles

#### Primary Button
```css
background: #10b981;
color: white;
padding: 14px;
border-radius: 10px;
font-size: 15px;
font-weight: 600;
transition: all 0.3s ease;

hover:
  background: #059669;
  transform: translateY(-2px);
```

#### Secondary Button
```css
background: #1e293b;
color: #e2e8f0;
padding: 10px 18px;
border: 1px solid #334155;
border-radius: 8px;
font-size: 13px;
font-weight: 600;

hover:
  background: #334155;
  border-color: #475569;
```

#### Timeframe Button
```css
background: transparent;
color: #64748b;
padding: 6px 12px;
border-radius: 6px;
font-size: 12px;
font-weight: 600;

hover:
  color: #e2e8f0;

active:
  background: #334155;
  color: #f1f5f9;
```

### Card Styles

#### Market Card
```css
background: #0f172a;
border: 1px solid #1e293b;
border-radius: 12px;
padding: 24px;

hover:
  border-color: #334155;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
```

#### Stat Item
```css
background: #1e293b;
border: 1px solid #334155;
border-radius: 8px;
padding: 16px;
```

### Input Styles

#### Text Input
```css
background: #1e293b;
border: 1px solid #334155;
border-radius: 8px;
color: #e2e8f0;
padding: 10px 14px;
font-size: 14px;

focus:
  outline: none;
  border-color: #10b981;
```

#### Select Dropdown
```css
background: #1e293b;
border: 1px solid #334155;
border-radius: 8px;
color: #e2e8f0;
padding: 10px 14px;
cursor: pointer;

option:
  background: #1e293b;
  color: #e2e8f0;
```

### Badge Styles

#### Market Badge
```css
display: inline-block;
padding: 4px 10px;
background: #1e293b;
color: #10b981;
border: 1px solid #334155;
border-radius: 6px;
font-weight: 600;
font-size: 13px;
```

### Table Styles

#### Table Header (th)
```css
padding: 16px;
color: #64748b;
border-bottom: 1px solid #1e293b;
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.5px;
```

#### Table Cell (td)
```css
padding: 16px;
border-bottom: 1px solid #1e293b;
color: #e2e8f0;
font-size: 14px;
```

#### Table Row Hover
```css
tbody tr:hover {
  background: #1e293b;
}
```

---

## Scrollbar Styling

```css
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
```

---

## Transitions

### Standard Transition
```css
transition: all 0.3s ease;
```

### Fast Transition
```css
transition: all 0.2s ease;
```

### Slow Transition
```css
transition: all 0.5s ease;
```

---

## Chart Configuration

### Chart.js Theme
```javascript
{
  type: 'line',
  options: {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          color: '#64748b',
          font: { size: 11 }
        }
      },
      y: {
        grid: { color: '#1e293b' },
        ticks: { 
          color: '#64748b',
          font: { size: 11 }
        }
      }
    }
  }
}
```

---

## Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 768px) {
  /* Stacked Layout */
  .markets-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  /* 2 Column Layout */
  .markets-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1025px) {
  /* Auto-fit Layout */
  .markets-grid {
    grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  }
}
```

---

## Animation Examples

### Hover Lift
```css
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}
```

### Scale on Hover
```css
.button {
  transition: transform 0.2s ease;
}

.button:hover {
  transform: scale(1.02);
}
```

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation: fadeIn 0.3s ease-in;
}
```

---

## Accessibility

### Focus States
```css
*:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

*:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}
```

### Screen Reader Only
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Usage Examples

### Creating a New Card
```html
<div class="stat-item">
  <div class="stat-label">Label Text</div>
  <div class="stat-value">$123.45</div>
</div>
```

### Creating a Button
```html
<button class="submit-btn">
  Action Text
</button>
```

### Creating a Badge
```html
<span class="market-badge">BTC</span>
```

---

## Design Principles

1. **Consistency**: Verwende das etablierte Spacing-System
2. **Contrast**: Stelle ausreichenden Kontrast sicher (WCAG AA)
3. **Hierarchy**: Nutze Font-Größen und Weights für visuelle Hierarchie
4. **Feedback**: Gebe visuelles Feedback bei Interaktionen
5. **Performance**: Bevorzuge CSS-Transforms über Position-Änderungen

---

## Tools & Resources

- **Color Picker**: [Coolors.co](https://coolors.co)
- **Contrast Checker**: [WebAIM](https://webaim.org/resources/contrastchecker/)
- **Typography**: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- **Icons**: Unicode Emojis für maximale Kompatibilität

---

Diese Design-Reference dient als Single Source of Truth für alle visuellen Elemente des Projekts. Bei Anpassungen sollte diese Datei stets aktuell gehalten werden.
