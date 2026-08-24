// Vom Scrollen gesteuerte Landschaft auf der Startseite.
//
// Das Video läuft nie von selbst. Es gibt kein play(), keinen Ton und keine
// Schleife: Die einzige Grösse, die hier gesetzt wird, ist currentTime, und die
// hängt allein daran, wie weit der Abschnitt durchgescrollt ist.

(function () {
  const section = document.querySelector('[data-scrollvideo]');
  if (!section) return;

  const frame = section.querySelector('.scrollvideo-frame');
  if (!frame) return;

  // Dieselbe Bedingung steht als Media Query in css/style.css und gibt dem
  // Abschnitt dort seine Scrollhöhe. Wird eine der beiden geändert, muss die
  // andere mit: Sonst bekommt die Seite 2800 px Scrollstrecke ohne Video oder
  // ein Video ohne Strecke, auf der es sich bewegen könnte.
  // Auf schmalen Bildschirmen und bei Zeigegeräten ohne Maus ruckelt das
  // programmgesteuerte Springen im Video, unter iOS Safari greift es teils gar
  // nicht. Dort bleibt es beim Standbild aus dem Markup, und das Video wird
  // nicht geladen.
  const SCRUB_QUERY =
    '(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
  if (!window.matchMedia(SCRUB_QUERY).matches) return;

  const video = document.createElement('video');
  video.className = 'scrollvideo-video';
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.poster = 'img/landscape-last-frame.jpg';
  // Die Eigenschaften allein reichen manchen Browsern nicht, die Attribute
  // müssen ebenfalls am Element stehen.
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.src = 'vid/kettenki_landscape_scrub.mp4';
  // In den Rahmen, der die Anzeigegrösse deckelt: hinter das Standbild, das es
  // damit verdeckt, sobald es Bilder hat, aber vor den Verlauf, der weiter
  // obenauf liegen soll.
  frame.insertBefore(video, frame.querySelector('.scrollvideo-veil'));

  let duration = 0;
  let current = 0; // die gezeigte Position, 0 bis 1
  let target = 0; // die vom Scrollstand geforderte Position, 0 bis 1
  let rafId = null;

  function scrollProgress() {
    // Die Strecke, über die gescrubbt wird, ist die Höhe des Abschnitts abzüglich
    // des einen Bildschirms, den das klebende Bild darin einnimmt.
    const range = section.offsetHeight - window.innerHeight;
    if (range <= 0) return 0;
    const travelled = -section.getBoundingClientRect().top;
    return Math.min(1, Math.max(0, travelled / range));
  }

  function seek() {
    // Genau auf duration zu springen liegt hinter dem letzten Bild, manche
    // Browser fallen dann auf das erste zurück. Knapp davor bleibt das letzte
    // Bild stehen, ganz ohne Sonderfall am Ende der Strecke.
    video.currentTime = Math.min(current, 0.999) * duration;
  }

  // Der Scrollwert wird nicht direkt übernommen, sondern pro Bild ein Stück weit
  // angenähert. Ohne das springt das Video den Scrollschritten hinterher, statt
  // ihnen zu folgen, besonders beim Zurückscrollen.
  function step() {
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0005) {
      current = target;
      rafId = null;
    } else {
      rafId = requestAnimationFrame(step);
    }
    seek();
  }

  function onScroll() {
    target = scrollProgress();
    if (rafId === null) rafId = requestAnimationFrame(step);
  }

  // duration steht erst mit den Metadaten fest, vorher wäre jede Rechnung NaN.
  video.addEventListener(
    'loadedmetadata',
    function () {
      duration = video.duration;
      if (!duration || !isFinite(duration)) return;

      current = scrollProgress();
      target = current;
      seek();

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    },
    { once: true }
  );
})();
