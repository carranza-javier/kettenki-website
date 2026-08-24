// Was auf der Startseite am Scrollen hängt: die Landschaft und die beiden
// leisen Hinweise, die zum Scrollen einladen.
//
// Die Landschaft läuft in zwei Spielarten, je nach Gerät:
//   - Am Rechner mit Maus hängt sie am Scrollrad. Kein play(), keine Schleife,
//     kein Ton: gesetzt wird ausschliesslich currentTime, und die hängt daran,
//     wie weit der Abschnitt durchgescrollt ist.
//   - Auf dem Handy wäre genau das die falsche Technik. Das programmgesteuerte
//     Springen im Video ruckelt dort und greift unter iOS Safari teils gar
//     nicht. Also läuft das Video da einfach einmal ab, sobald es im Bild ist.
// Bei reduzierter Bewegung passiert beides nicht, dann bleibt das Standbild aus
// dem Markup stehen und es wird nichts geladen.

// Der Hinweis im Kopfbereich steht vor der Video-Weiche: Er gehört auch auf
// Geräte, die das Video gar nicht laden, denn gescrollt wird dort genauso.
(function () {
  const cue = document.querySelector('.scroll-cue');
  if (!cue) return;

  function spend() {
    if (window.scrollY < 40) return;
    cue.classList.add('is-spent');
    window.removeEventListener('scroll', spend);
  }

  window.addEventListener('scroll', spend, { passive: true });
  spend(); // Beim Neuladen mitten auf der Seite gar nicht erst aufblitzen lassen.
})();

(function () {
  const section = document.querySelector('[data-scrollvideo]');
  if (!section) return;

  const frame = section.querySelector('.scrollvideo-frame');
  if (!frame) return;

  // Wer weniger Bewegung möchte, bekommt gar keine: kein Video, kein Laden,
  // keine Listener. Diese Prüfung steht zuerst, damit sie beide Spielarten
  // abfängt und nicht nur die am Scrollrad.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Dieselbe Bedingung steht als Media Query in css/style.css und gibt dem
  // Abschnitt dort seine Scrollhöhe. Wird eine der beiden geändert, muss die
  // andere mit: Sonst bekommt die Seite 2800 px Scrollstrecke ohne Video oder
  // ein Video ohne Strecke, auf der es sich bewegen könnte.
  const SCRUB_QUERY =
    '(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
  const scrubs = window.matchMedia(SCRUB_QUERY).matches;

  const video = document.createElement('video');
  video.className = 'scrollvideo-video';
  video.muted = true;
  video.playsInline = true;
  video.poster = 'img/landscape-last-frame.jpg';
  // Am Scrollrad muss jede Stelle sofort greifbar sein, deshalb dort alles im
  // Voraus. Auf dem Handy zuerst nur die Metadaten: Die vollen Megabyte fallen
  // erst an, wenn das Video wirklich im Bild ist und losläuft.
  video.preload = scrubs ? 'auto' : 'metadata';
  // Die Eigenschaften allein reichen manchen Browsern nicht, die Attribute
  // müssen ebenfalls am Element stehen. Ohne muted und playsinline verweigert
  // iOS Safari das Abspielen ohne Fingertipp.
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.src = 'vid/kettenki_landscape_scrub.mp4';
  // In den Rahmen: hinter das Standbild, das es damit verdeckt, sobald es
  // Bilder hat, aber vor den Verlauf, der weiter obenauf liegen soll.
  frame.insertBefore(video, frame.querySelector('.scrollvideo-veil'));

  if (!scrubs) {
    playWhenVisible();
    return;
  }

  // --------------------------------------------------------------------------
  // Handy und Tablet: einmal abspielen, sobald es im Bild ist
  // --------------------------------------------------------------------------
  function playWhenVisible() {
    // Ohne IntersectionObserver bleibt es beim Standbild, das ist kein Verlust.
    if (!('IntersectionObserver' in window)) return;

    let done = false;

    // Am Ende auf dem letzten Bild stehen bleiben, genau wie am Scrollrad, und
    // nicht bei jedem Vorbeiscrollen von vorn anfangen.
    video.addEventListener('ended', function () {
      done = true;
      observer.disconnect();
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (done) return;
          if (entry.isIntersecting) {
            // Schlägt fehl, wenn der Browser das Abspielen verweigert, etwa im
            // Stromsparmodus. Dann bleibt einfach das Standbild stehen, deshalb
            // wird der Fehler geschluckt statt in der Konsole zu landen.
            const started = video.play();
            if (started && started.catch) started.catch(function () {});
          } else {
            // Aus dem Bild gescrollt: anhalten, aber die Stelle behalten.
            video.pause();
          }
        });
      },
      // Erst ab einem guten Drittel im Bild, sonst startet es, während vom
      // Video nur ein Streifen am unteren Rand zu sehen ist.
      { threshold: 0.35 }
    );

    observer.observe(section);
  }

  // --------------------------------------------------------------------------
  // Rechner mit Maus: das Scrollrad führt
  // --------------------------------------------------------------------------
  let duration = 0;
  let current = 0; // die gezeigte Position, 0 bis 1
  let target = 0; // die vom Scrollstand geforderte Position, 0 bis 1
  let rafId = null;
  let running = false;

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

    // Speist den Fortschrittsbalken des Hinweises.
    section.style.setProperty('--scrub-progress', current.toFixed(4));

    // Nur beim Wechsel anfassen, nicht bei jedem Einzelbild.
    const moved = current > 0.03;
    if (moved !== running) {
      running = moved;
      section.classList.toggle('is-running', running);
    }
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

      // Ab hier gibt es etwas zu sehen, also darf der Hinweis erscheinen.
      section.classList.add('is-scrubbing');

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    },
    { once: true }
  );
})();
