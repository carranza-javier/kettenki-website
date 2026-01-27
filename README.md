# kettenKI Website

Professionelle, minimalistische und vollständig responsive Website für kettenKI - KI-Lösungen in Cloud-Architekturen für Schweizer Unternehmen.

## Eigenschaften

- ✅ **Vollständig Responsive**: Funktioniert perfekt auf allen Geräten (Desktop, Tablet, Mobile)
- 🌐 **Multi-Sprache**: Deutsch und Englisch mit einfachem Umschalter
- 🎨 **Modernes Design**: Minimalistische Ästhetik mit elektrischem Blau-zu-Smaragd-Farbverlauf
- ⚡ **Performance-optimiert**: Schnelle Ladezeiten mit optimiertem CSS und JavaScript
- 🔍 **SEO-optimiert**: Vollständige Meta-Tags, strukturierte Daten, Sitemap und robots.txt
- ♿ **Accessibility**: WCAG-konform mit semantischem HTML

## Projektstruktur

```
kettenki-web/
├── index.html              # Homepage
├── about.html              # Über mich
├── services.html           # Lösungen/Anwendungsfälle
├── contact.html            # Kontakt
├── robots.txt              # SEO: Crawling-Anweisungen
├── sitemap.xml             # SEO: Sitemap
├── .htaccess               # Server-Konfiguration
├── css/
│   ├── style.css           # Haupt-Styles
│   ├── responsive.css      # Responsive Design
│   └── animations.css      # Animationen und Effekte
├── js/
│   ├── main.js             # Haupt-JavaScript
│   └── translations.js     # Multi-Sprachen-System
├── images/                 # Bilder (leer, nach Bedarf hinzufügen)
└── assets/                 # Andere Ressourcen (Favicon, etc.)
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

### Typografie
- Font: Zalando Sans Expanded (Google Fonts)
- Gewichte: 200-900 (Variable Font)

### Animationen
- Fade-in beim Scrollen
- Hover-Effekte auf Karten und Links
- Sanfte Übergänge
- Pulsierender Hintergrund im Hero-Bereich

## SEO-Optimierungen

1. **Meta-Tags**: Vollständige title, description, keywords für jede Seite
2. **Open Graph**: Social Media Integration
3. **Strukturierte Daten**: Schema.org JSON-LD für alle Seiten
4. **Sitemap**: XML-Sitemap für Suchmaschinen
5. **Robots.txt**: Crawling-Konfiguration
6. **Canonical URLs**: Duplicate Content vermeiden
7. **Language Alternates**: hreflang für Mehrsprachigkeit
8. **Geo-Tags**: Standort-Targeting für Schweiz/Bern
9. **Semantic HTML**: Korrekte HTML5-Struktur
10. **Performance**: Schnelle Ladezeiten, optimierte Assets

## Multi-Sprachen-System

Das Sprach-System verwendet:
- LocalStorage für Sprachpräferenz
- data-i18n Attribute für übersetzbare Elemente
- Einfaches Umschalten zwischen DE/EN
- Standardsprache: Deutsch

## Installation

1. Alle Dateien auf Webserver hochladen
2. Sicherstellen, dass .htaccess funktioniert (Apache)
3. SSL-Zertifikat konfigurieren (empfohlen)
4. Favicon und andere Assets hinzufügen
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
```

### Übersetzungen hinzufügen
Bearbeite `js/translations.js` und füge neue Sprachen hinzu.

### Inhalte aktualisieren
Direkt in den HTML-Dateien oder über das data-i18n System.

## Lizenz

© 2026 kettenKI - Javier Carranza

## Kontakt

- **Email**: javier@kettenki.com
- **LinkedIn**: linkedin.com/in/javiercarranza
- **Website**: https://kettenki.com
