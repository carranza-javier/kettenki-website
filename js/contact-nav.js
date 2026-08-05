// Kontext-Übernahme auf contact.html: Menü und Seitenthema.
//
// Kontakt ist die einzige Seite, die in beiden Menüs vorkommt (SPEC 2).
// Wer aus Portfolio/Blog kommt, soll dort nicht im kommerziellen Menü
// landen und den Rückweg verlieren, und auch nicht aus dem hellen
// Portfolio/Blog-Raum zurück ins dunkle Markenlayout fallen (SPEC 3.2).
// Die Herkunft steht im Query-Parameter "from" (?from=portfolio bzw.
// ?from=blog), gesetzt von den Nav-Links in portfolio/* und blog/*.
// Ohne Parameter bleibt alles wie bisher: kommerzielles Menü
// (Start | Über mich | Lösungen | Kontakt) auf dunklem Hintergrund.

const contactFrom = new URLSearchParams(window.location.search).get('from');
const contactFromSection = contactFrom === 'portfolio' || contactFrom === 'blog';

// Absichtlich sofort beim Ausführen des Skripts, nicht erst in
// DOMContentLoaded: das Skript steht am Ende von <body>, document.body
// existiert also bereits, und das Theme sitzt so früh wie möglich. Im
// Listener gesetzt, wäre der dunkle Hintergrund kurz sichtbar gewesen.
if (contactFromSection && document.body) {
  document.body.classList.add('theme-light');

  // Inter kommt hier per JS statt als <link> im <head>, weil das Thema
  // auf dieser Seite die Ausnahme ist: Besucher ohne Parameter sollen
  // keinen Font-Request bezahlen, den sie nie brauchen. Portfolio/Blog
  // laden Inter weiterhin statisch, dort ist es der Normalfall.
  const inter = document.createElement('link');
  inter.rel = 'stylesheet';
  inter.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap';
  document.head.appendChild(inter);

  // Titel auf das kompakte Format von Portfolio/Blog umstellen: derselbe
  // h1, nur andere Klasse. Der grosse zentrierte Verlaufstitel gehört zum
  // kommerziellen Auftritt und passt nicht in die helle Sektionskopfzeile.
  // .contact-title--compact ergänzt nur den Abstand nach unten, den auf
  // den anderen Seiten der .pb-header-Wrapper samt Trennlinie liefert.
  const title = document.querySelector('h1.section-title');
  if (title) {
    title.classList.remove('section-title');
    title.classList.add('pb-header-title', 'contact-title--compact');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!contactFromSection) return;

  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return;

  const langSelector = navMenu.querySelector('.lang-selector');

  // Nur die Seitenlinks austauschen, der Sprachumschalter bleibt stehen.
  navMenu.querySelectorAll('li:not(.lang-selector)').forEach(li => li.remove());

  const links = [
    { href: '/portfolio/', key: 'nav_portfolio', text: 'Portfolio' },
    { href: '/blog/', key: 'nav_blog', text: 'Blog' },
    // Herkunft mitgeben, damit ein Klick auf Kontakt nicht zurück ins
    // kommerzielle Menü fällt.
    { href: 'contact?from=' + contactFrom, key: 'nav_contact', text: 'Kontakt', active: true }
  ];

  links.forEach(({ href, key, text, active }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.setAttribute('data-i18n', key);
    a.textContent = text;
    // main.js vergleicht den href mit dem Dateinamen und findet den
    // Kontakt-Link wegen des Query-Parameters nicht, also hier direkt setzen.
    if (active) a.classList.add('active');
    li.appendChild(a);
    navMenu.insertBefore(li, langSelector);
  });

  // Gleiche Situation wie in blog-filter.js: translations.js hat seinen
  // updateContent()-Durchlauf schon hinter sich (Ladereihenfolge), die
  // eben erzeugten Links waren da noch nicht vorhanden.
  if (typeof updateContent === 'function') updateContent();
});
