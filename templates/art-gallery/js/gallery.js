/* Halle Neun, Demo-Portfolio für KettenKI.
   Baut das Raster auf der Startseite und die Werkseite aus dem
   Werkverzeichnis in works.js. Kein Server, kein Framework, kein Build. */

/* Wie breit eine Zelle im Raster tatsächlich wird, hängt an ihrer Spanne.
   Der Browser soll nicht raten müssen, welche der beiden Dateien er holt. */
const GRID_SIZES = {
  full: '(min-width: 700px) 88vw, 92vw',
  wide: '(min-width: 700px) 52vw, 92vw',
  mid: '(min-width: 700px) 37vw, 92vw',
  third: '(min-width: 700px) 29vw, 92vw',
};

/* ---------- Werkzeug ---------- */

function picture(work, sizes, loading) {
  return (
    '<img src="img/' + work.image + '-sm.webp"' +
    ' srcset="img/' + work.image + '-sm.webp 688w, img/' + work.image + '-lg.webp 1376w"' +
    ' sizes="' + sizes + '" alt="' + work.alt + '"' +
    ' width="1376" height="768" loading="' + loading + '" decoding="async">'
  );
}

function caption(work) {
  return work.technique + ', ' + work.year;
}

/* ---------- Raster auf der Startseite ---------- */

function renderGrid() {
  const host = document.querySelector('[data-grid]');
  if (!host) return;

  host.innerHTML = LAYOUT.map(function (cell, index) {
    const work = findWork(cell.id);
    if (!work) return '';

    /* Die Videozelle hat dasselbe Seitenverhältnis und dieselbe
       Bildunterschrift wie ihre Nachbarn. Erst die Bewegung verrät sie.
       Bis der Film geladen ist, steht das Standbild der Arbeit im Rahmen,
       damit an dieser Stelle nie ein Loch klafft. */
    const media = cell.film
      ? '<video src="' + work.video + '" poster="img/' + work.image + '-sm.webp" ' +
        'autoplay muted loop playsinline preload="metadata" aria-label="' + work.videoAlt + '"></video>'
      : picture(work, GRID_SIZES[cell.span], index < 2 ? 'eager' : 'lazy');

    const mark = cell.film ? '<span class="tile__film">Bewegt</span>' : '';

    return (
      '<a class="tile reveal tile--' + cell.span + (cell.push ? ' tile--push' : '') + '"' +
      ' href="work.html?w=' + work.id + '">' +
        '<span class="tile__media">' + media + '</span>' +
        '<span class="tile__meta">' +
          '<span class="tile__no">' + workNumber(work.id) + '</span>' +
          '<span class="tile__title">' + work.title + '</span>' +
          mark +
          '<span class="tile__line">' + caption(work) + '</span>' +
        '</span>' +
      '</a>'
    );
  }).join('');

  const counter = document.querySelector('[data-work-count]');
  if (counter) counter.textContent = String(WORKS.length);
}

/* ---------- Werkseite ---------- */

function renderPiece() {
  const host = document.querySelector('[data-piece]');
  if (!host) return;

  const id = new URLSearchParams(location.search).get('w');
  const work = findWork(id);
  if (!work) {
    location.replace('index.html');
    return;
  }

  document.title = work.title + ', ' + work.year + ' | ' + STUDIO.name;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', work.title + ', ' + caption(work) + '. ' + work.note[0]);

  /* Bei der Installation steht der Film zuoberst: Sie ist ohne Bewegung
     nur halb zu sehen. */
  const film = work.video
    ? '<figure class="shot">' +
        '<video src="' + work.video + '" poster="img/' + work.image + '-lg.webp" ' +
        'autoplay muted loop playsinline preload="metadata" aria-label="' + work.videoAlt + '"></video>' +
        '<figcaption>Aufnahme aus der Halle, Schleife 9 Sekunden</figcaption>' +
      '</figure>'
    : '';

  const details = [
    ['Technik', work.technique],
    ['Jahr', String(work.year)],
    ['Mass', work.size],
    ['Status', work.state],
  ];

  host.innerHTML =
    '<div class="piece__shots">' +
      film +
      '<figure class="shot">' + picture(work, '(min-width: 1000px) 62vw, 92vw', 'eager') +
        (work.video ? '<figcaption>Installationsansicht, Halle Neun</figcaption>' : '') +
      '</figure>' +
    '</div>' +
    '<div class="piece__panel">' +
      '<p class="piece__no">' + workNumber(work.id) + ' / ' + String(WORKS.length).padStart(2, '0') +
        ' &middot; ' + work.kind + '</p>' +
      '<h1 class="display piece__title">' + work.title + '</h1>' +
      '<div class="piece__note">' +
        work.note.map((part) => '<p>' + part + '</p>').join('') +
      '</div>' +
      '<dl class="facts">' +
        details.map((row) => '<div><dt>' + row[0] + '</dt><dd>' + row[1] + '</dd></div>').join('') +
      '</dl>' +
      '<a class="btn piece__ask" href="index.html#kontakt">Anfrage zu dieser Arbeit</a>' +
    '</div>';

  renderPager(work);
  watchVideos();
  watchReveals();
}

/* Vor und zurück durch das Verzeichnis, damit man nicht jedes Mal zur
   Übersicht zurückmuss. Am Ende geht es wieder von vorne los. */
function renderPager(current) {
  const host = document.querySelector('[data-pager]');
  if (!host) return;

  const index = WORKS.findIndex((work) => work.id === current.id);
  const previous = WORKS[(index - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(index + 1) % WORKS.length];

  host.innerHTML = [
    ['Zurück', previous],
    ['Weiter', next],
  ].map(function (row) {
    return (
      '<a href="work.html?w=' + row[1].id + '">' +
        '<span class="pager__dir">' + row[0] + '</span>' +
        '<span class="pager__name">' + row[1].title + '</span>' +
      '</a>'
    );
  }).join('');
}

/* ---------- Bewegung ---------- */

function calmRequested() {
  return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* Videos laufen nur, solange sie zu sehen sind: das spart Daten und schont
   den Akku. Wer im System weniger Bewegung eingestellt hat, bekommt ein
   Standbild. */
function watchVideos() {
  const videos = document.querySelectorAll('video');
  if (!videos.length) return;

  if (calmRequested()) {
    videos.forEach(function (video) {
      video.autoplay = false;
      video.pause();
    });
    return;
  }

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      const video = entry.target;
      if (entry.isIntersecting) {
        const started = video.play();
        if (started && started.catch) started.catch(function () { /* Browser mag nicht, Standbild reicht auch. */ });
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });

  videos.forEach((video) => observer.observe(video));
}

function watchReveals() {
  const items = document.querySelectorAll('.reveal:not(.is-in)');
  if (!items.length) return;

  if (calmRequested() || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  items.forEach((item) => observer.observe(item));
}

/* Die Kopfzeile bekommt erst eine Linie, wenn tatsächlich etwas darunter
   durchläuft. */
function watchMasthead() {
  const masthead = document.querySelector('.masthead');
  if (!masthead) return;

  const mark = function () {
    masthead.classList.toggle('is-stuck', window.scrollY > 24);
  };
  mark();
  window.addEventListener('scroll', mark, { passive: true });
}

/* ---------- Kontaktformular ---------- */

/* Attrappe: Die Demo hat keinen Server. Statt zu senden, bestätigt das
   Formular sichtbar und räumt sich selbst auf. */
function wireForm() {
  const form = document.querySelector('[data-form]');
  if (!form) return;

  const sent = form.querySelector('[data-form-sent]');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.reset();
    if (sent) {
      sent.hidden = false;
      sent.focus({ preventScroll: true });
    }
  });
}

/* ---------- Start ---------- */

document.addEventListener('DOMContentLoaded', function () {
  renderGrid();
  renderPiece();
  watchMasthead();
  wireForm();
  watchVideos();
  watchReveals();

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
});
