# KettenKI Website

Experimentelle KI-Prototypen-Plattform für Schweizer Unternehmen - Offener und kollaborativer Ansatz.

## Projektphilosophie

KettenKI arbeitet nach einem innovativen Modell:

- 🧪 **Experimentelle Prototypen** - Keine geschlossenen kommerziellen Lösungen
- 🤝 **Gemeinsame Entwicklung** - Wenn es funktioniert, skalieren wir zusammen
- 📖 **Open Source** - Volle Transparenz
- 🌱 **Gemeinsames Lernen** - Unternehmen validieren, ich verbessere

Dieses Modell ermöglicht es kleinen Unternehmen, auf KI-Technologie ohne große Anfangsinvestitionen zuzugreifen, während ich ein echtes Portfolio aufbaue und aus konkreten Anwendungsfällen lerne.

## Eigenschaften

- ✅ **Vollständig Responsive**: Funktioniert perfekt auf allen Geräten (Desktop, Tablet, Mobile)
- 🌐 **Multi-Sprache**: Deutsch und Englisch mit einfachem Umschalter
- 🎨 **Modernes Design**: Minimalistische Ästhetik mit elektrischem Blau-zu-Smaragd-Farbverlauf
- ⚡ **Performance-optimiert**: Schnelle Ladezeiten mit optimiertem CSS und JavaScript
- 🔍 **SEO-optimiert**: Vollständige Meta-Tags, strukturierte Daten, Sitemap und robots.txt
- ♿ **Accessibility**: WCAG-konform mit semantischem HTML
- 🧪 **Prototyp-Badges**: Klare Kennzeichnung experimenteller Lösungen

## Projektstruktur

```
kettenki-web/
├── index.html              # Homepage
├── about.html              # Über mich
├── services.html           # Prototypen/Lösungen
├── bambera.html            # BAMBERA Prototyp
├── liviana.html            # LIVIANA Prototyp
├── fandango.html           # FANDANGO Prototyp
├── contact.html            # Kontakt
├── robots.txt              # SEO: Crawling-Anweisungen
├── sitemap.xml             # SEO: Sitemap
├── .htaccess               # Server-Konfiguration
├── css/
│   ├── style.css           # Haupt-Styles (inkl. Prototyp-Styles)
│   ├── responsive.css      # Responsive Design
│   └── animations.css      # Animationen und Effekte
├── js/
│   ├── main.js             # Haupt-JavaScript
│   └── translations.js     # Multi-Sprachen-System (DE/EN)
├── img/                    # Bilder und Maskottchen
└── assets/                 # Favicon, Icons, etc.
```

## Technologien

- **HTML5**: Semantisches Markup
- **CSS3**: Variables, Grid, Flexbox, Animationen
- **Vanilla JavaScript**: Keine Dependencies, leichtgewichtig
- **Google Fonts**: Zalando Sans Expanded
- **Schema.org**: Strukturierte Daten für SEO

## Design-Highlights

### Farbschema
- Hintergrund: Dunkel (#0a0a0a)
- Text: Cloud Dancer (#f4f4f4)
- Akzent: Elektrisches Blau zu Smaragd Verlauf (#00d4ff → #00ff88)
- Prototyp-Badge: Gold/Orange (#ffc107)

### Typografie
- Font: Zalando Sans Expanded (Google Fonts)
- Gewichte: 200-900 (Variable Font)

### Animationen
- Fade-in beim Scrollen
- Hover-Effekte auf Karten und Links
- Sanfte Übergänge
- Pulsierender Hintergrund im Hero-Bereich

## Prototypen-System

### Disclaimer-Komponente
Warnt Benutzer, dass die Lösungen experimentell sind:
- Gelb/orange gestaltete Warnung
- Keine Garantie oder SLA
- Möglichkeit gemeinsamer Weiterentwicklung

### Prototyp-Badges
Jedes Produkt zeigt ein `🧪 Prototyp` Badge:
- Position: Oben rechts auf Produktkarten
- Farbe: Gold (#ffc107)
- Responsive: Passt sich mobilen Geräten an

## SEO-Optimierungen

1. **Meta-Tags**: Vollständige title, description, keywords für jede Seite
2. **Open Graph**: Social Media Integration
3. **Strukturierte Daten**: Schema.org JSON-LD für alle Seiten
4. **Sitemap**: XML-Sitemap für Suchmaschinen
5. **Robots.txt**: Crawling-Konfiguration
6. **Canonical URLs**: Duplicate Content vermeiden
7. **Language Alternates**: hreflang für Mehrsprachigkeit (DE/EN)
8. **Geo-Tags**: Standort-Targeting für Schweiz/Bern
9. **Semantic HTML**: Korrekte HTML5-Struktur
10. **Performance**: Schnelle Ladezeiten, optimierte Assets

## Multi-Sprachen-System

Das Sprach-System verwendet:
- LocalStorage für Sprachpräferenz
- data-i18n Attribute für übersetzbare Elemente
- Einfaches Umschalten zwischen DE/EN
- Standardsprache: Deutsch
- Neue Texte für Prototyp-Ansatz in beiden Sprachen

## Installation & Deployment

1. Alle Dateien auf Webserver hochladen
2. Sicherstellen, dass .htaccess funktioniert (Apache)
3. SSL-Zertifikat konfigurieren (empfohlen)
4. Favicon und Bilder im `/img` Verzeichnis platzieren
5. Google Analytics/Search Console einrichten (optional)

## Browser-Unterstützung

- Chrome (neueste 2 Versionen)
- Firefox (neueste 2 Versionen)
- Safari (neueste 2 Versionen)
- Edge (neueste 2 Versionen)
- Mobile Browser (iOS Safari, Chrome Mobile)

## Performance-Tipps

- Bilder optimieren (WebP-Format verwenden)
- Lazy Loading für Bilder implementieren
- CDN für statische Assets nutzen
- Caching-Header prüfen (.htaccess)
- Minify CSS/JS für Produktion

## Anpassungen

### Farben ändern
Bearbeite die CSS-Variablen in `css/style.css`:
```css
:root {
  --color-accent-start: #00d4ff;
  --color-accent-end: #00ff88;
  /* ... */
}

### Übersetzungen hinzufügen
Bearbeite `js/translations.js` und füge neue Sprachen hinzu.

### Inhalte aktualisieren
Direkt in den HTML-Dateien oder über das data-i18n System.

## Geschäftsmodell

**Prototyp-Ansatz:**
1. Unternehmen testet kostenlos
2. Feedback und Validierung
3. Bei Erfolg: Gemeinsame Finanzierung der Produktionsversion
4. Skalierung und Weiterentwicklung

**Vorteile:**
- Geringes Risiko für Unternehmen
- Echte Validierung vor großer Investition
- Portfolio-Aufbau mit realen Anwendungsfällen
- Win-Win-Situation

## Lizenz

© 2026 KettenKI - Javier Carranza

Code ist offen und transparent verfügbar.

## Kontakt

- **Email**: info@kettenki.com
- **LinkedIn**: linkedin.com/company/kettenki
- **Website**: https://kettenki.com

---

**Entwickelt mit Präzision in Bern, Schweiz** 🇨🇭