// Menü-Kontinuität auf contact.html.
//
// Kontakt ist die einzige Seite, die in beiden Menüs vorkommt (SPEC 2).
// Wer aus Portfolio/Blog kommt, soll dort nicht im kommerziellen Menü
// landen und den Rückweg verlieren. Die Herkunft steht im Query-Parameter
// "from" (?from=portfolio bzw. ?from=blog), gesetzt von den Nav-Links in
// portfolio/* und blog/*. Ohne Parameter bleibt alles wie bisher:
// Start | Über mich | Lösungen | Kontakt.

document.addEventListener('DOMContentLoaded', () => {
  const from = new URLSearchParams(window.location.search).get('from');
  if (from !== 'portfolio' && from !== 'blog') return;

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
    { href: 'contact?from=' + from, key: 'nav_contact', text: 'Kontakt', active: true }
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
