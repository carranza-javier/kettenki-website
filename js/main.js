// Main JavaScript functionality

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const opened = navMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
      // Zugeklapptes Menü heisst zugeklappte Unterpunkte: Sonst steht die Klappe
      // beim nächsten Öffnen schon offen, obwohl niemand sie angetippt hat.
      if (!opened) closeDropdowns();
    });
  }
  
  // Aufklappmenü unter "Lösungen".
  // Am Rechner öffnet es schon beim Zeigen, das steht im Stylesheet. Hier geht
  // es um den Weg, den es dort nicht gibt: den Fingertipp. Der Knopf ist die
  // einzige Bedienung auf dem Handy, und aria-expanded sagt die Wahrheit über
  // beides, damit auch ein Screenreader weiss, ob offen oder zu ist.
  const dropdowns = Array.from(document.querySelectorAll('.nav-item-dropdown'));

  function closeDropdowns(except) {
    dropdowns.forEach((item) => {
      if (item === except) return;
      item.classList.remove('is-open');
      const toggle = item.querySelector('.nav-submenu-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach((item) => {
    const toggle = item.querySelector('.nav-submenu-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      // Der Knopf steht neben einem Link. Ohne das hier trüge der Klick weiter
      // und schlösse gleich wieder, was er gerade geöffnet hat.
      e.preventDefault();
      e.stopPropagation();
      const open = !item.classList.contains('is-open');
      closeDropdowns(item);
      item.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item-dropdown')) closeDropdowns();

    if (navMenu && !e.target.closest('nav')) {
      navMenu.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
      closeDropdowns();
    }
  });

  // Escape schliesst, was offen ist: erst die Klappe, dann das Menü selbst.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeDropdowns();
    if (navMenu) {
      navMenu.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    }
  });
  
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
  
  // Der Parallax-Effekt des Kopfbereichs ist entfallen. Er verschob den
  // Kopfbereich beim Scrollen um die halbe Strecke nach unten, was so lange
  // unsichtbar blieb, wie darunter nichts stand. Seit die Startseite die
  // Angebotsblöcke trägt, schob sich der Kopfbereich sichtbar über sie:
  // bei 600 px Scrollhöhe ragte er 154 px in die erste Karte hinein.
  // .hero gibt es ausserdem nur auf index.html, hier hängt nichts anderes dran.
  
  // Active nav link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});
