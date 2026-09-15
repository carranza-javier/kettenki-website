/* Lernbereich. Zwei kleine Aufgaben: den zuletzt gebuchten Termin zeigen,
   falls es einen gibt, und den Fortschrittsbalken auffüllen, sobald man ihn
   sieht. Alles andere auf der Seite ist Beispielinhalt im HTML. */

(function () {
  'use strict';

  const BOOKING_KEY = 'sprachwerk-termin';
  const GOAL = 68;

  /* Datum oben rechts */
  const todayNode = document.querySelector('[data-today]');
  if (todayNode) {
    todayNode.textContent = new Intl.DateTimeFormat('de-CH', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date());
  }

  /* Der eigene Termin schlägt den Beispieltermin. */
  const whenNode = document.querySelector('[data-next-when]');
  const metaNode = document.querySelector('[data-next-meta]');

  if (whenNode && metaNode) {
    let booking = null;
    try {
      booking = JSON.parse(localStorage.getItem(BOOKING_KEY));
    } catch (err) {
      booking = null;
    }

    const stillAhead = booking && booking.day && new Date(booking.day + 'T23:59').getTime() >= Date.now();

    if (stillAhead) {
      whenNode.textContent = booking.dayLabel + ', ' + booking.time + ' Uhr';
      metaNode.innerHTML =
        '<span>' + booking.kind + ' mit Nina Brunner</span>' +
        '<span>' + booking.minutes + ' Minuten</span>' +
        '<span>' + (booking.online ? 'Online' : 'Effingerstrasse 12') + '</span>';
    }
  }

  /* Der Balken füllt sich erst, wenn er im Bild ist. Vorher sieht man die
     Bewegung nicht, und sie ist der halbe Sinn der Anzeige. */
  const bar = document.querySelector('[data-progress-bar]');
  const pct = document.querySelector('[data-progress-pct]');

  function fill() {
    bar.style.width = GOAL + '%';
    const started = performance.now();
    const tick = function (now) {
      const share = Math.min(1, (now - started) / 1100);
      pct.textContent = String(Math.round(share * GOAL));
      if (share < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if (bar && pct) {
    const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm || !('IntersectionObserver' in window)) {
      bar.style.width = GOAL + '%';
      pct.textContent = String(GOAL);
    } else {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          fill();
          observer.disconnect();
        });
      }, { threshold: 0.4 });
      observer.observe(bar);
    }
  }

  /* Die Dateien sind Platzhalter. Statt ins Leere zu springen, sagt die
     Seite einmal, warum sich nichts öffnet. */
  const note = document.querySelector('[data-file-note]');
  document.querySelectorAll('[data-demo-file]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      if (note) note.hidden = false;
    });
  });
})();
