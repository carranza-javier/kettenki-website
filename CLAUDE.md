# KettenKI website

`kettenki.com`: the commercial site of KettenKI (individuelle Softwareentwicklung für KMU in der
Schweiz), plus Javi's personal portfolio and blog under `portfolio/` and `blog/`. Static HTML/CSS/JS,
no framework, no build system.

## Read these three files before any task

They are the source of truth. This file only points to them and does not replace them.

- **`SPEC.md`**: fixed rules (information architecture, languages, themes, portfolio and blog
  structure, the Liviana chatbot).
- **`PROJECT-STATUS.md`**: current state, what is done, open, blocked, and decisions already taken.
  Read at least *Nächster Schritt*, *Offen*, *Verworfen* and *Entscheidungen / Notizen*.
- **`.agents/product-marketing.md`**: positioning, brand voice, banned words, canonical DE/EN copy.

Every change is documented in the same commit: project state in `PROJECT-STATUS.md`, positioning or
copy decisions in `.agents/product-marketing.md`.

## Rules that are easy to break by accident

- **Category is fixed:** "Individuelle Softwareentwicklung für KMU" (EN: custom software development
  for small and medium businesses). Never "Agentur", "Digitalagentur" or "Boutique".
- **Never "Ein-Mann-Agentur"** or any variant (Einzelunternehmer, Freelancer, solo, one-man). The
  one-person structure is always "direkter Kontakt, ohne Zwischenstellen", never a size.
- **du, never Sie**, across the whole commercial site. (Only exception: the fictional demo
  `templates/art-gallery`, which speaks Sie on purpose.)
- **No price in the process.** The process ends at "Andernfalls entstehen keine Kosten". No "Preis",
  "Kosten", "price" beyond that, no cheap/günstig wording.
- **Bambera is never "in production"** or in daily use, in any language, on any surface. It is an
  in-house prototype tested for three months with the Lumis Kaffeebar team.
- **Languages: DE and EN only, German default.** Every user-facing string needs a `data-i18n` key in
  both blocks of `js/translations.js`. No Spanish on the site, even though Javi works in Spanish.
- **Swiss German orthography:** ss, never ß.
- **No em or en dashes** in customer-facing copy, portfolio or blog.
- **Two audiences:** the dark commercial site speaks to SME customers; the light `portfolio/` and
  `blog/` (Inter font) speak to recruiters. Do not mix their copy or voice.
- **Nothing is deployed** without Javi's explicit go-ahead.
