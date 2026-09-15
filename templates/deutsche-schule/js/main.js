/* Gemeinsames Verhalten aller vier Seiten: Menü, Kopfzeile, Auftauchen. */

(function () {
  'use strict';

  /* Menü auf dem Telefon */
  const burger = document.querySelector('.burger');
  const drawer = document.getElementById('nav-drawer');

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      const open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Menü öffnen' : 'Menü schliessen');
      drawer.hidden = open;
    });

    /* Ein Klick auf einen Anker schliesst das Menü wieder, sonst steht es
       offen über dem Ziel, zu dem es gerade gesprungen ist. */
    drawer.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        drawer.hidden = true;
      }
    });
  }

  /* Die Kopfzeile bekommt erst eine Kante, wenn etwas unter ihr liegt. */
  const masthead = document.querySelector('.masthead');
  if (masthead) {
    const onScroll = function () {
      if (window.scrollY > 8) masthead.setAttribute('data-stuck', '');
      else masthead.removeAttribute('data-stuck');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Auftauchen beim Scrollen. Die Klasse versteckt nur, wenn Skript läuft
     (html.js), damit ohne JavaScript nichts unsichtbar bleibt. */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
  } else {
    document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-in'));
  }
})();
