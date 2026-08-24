// Was auf der Startseite am Scrollen hängt: die Landschaft und die beiden
// leisen Hinweise, die zum Scrollen einladen.
//
// Die Landschaft läuft in zwei Spielarten, je nach Gerät:
//   - Am Rechner mit Maus hängt sie am Scrollrad. Kein play(), keine Schleife,
//     kein Ton: gesetzt wird ausschliesslich currentTime, und die hängt daran,
//     wie weit der Abschnitt durchgescrollt ist.
//   - Auf dem Handy wäre genau das die falsche Technik. Das programmgesteuerte
//     Springen im Video ruckelt dort und greift unter iOS Safari teils gar
//     nicht. Also läuft das Video da einfach einmal ab, sobald es im Bild ist,
//     frühestens aber nach dem ersten Scrollen: Beim Aufsetzen der Seite soll
//     sich nichts von allein bewegen.
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
  // Zwei Standbilder, zwei Rollen. Am Scrollrad steht das Video beim Aufsetzen
  // sofort auf der Stelle, die der Scrollstand vorgibt, das Plakat ist dort nur
  // eine Notlösung fürs Laden. Auf dem Handy dagegen ist das Plakat minutenlang
  // das, was man sieht, bevor abgespielt wird: Da muss das **erste** Bild
  // stehen. Mit dem letzten sprang die Ansicht beim Start sichtbar vom
  // Drahtgitter zurück auf die Wiese.
  video.poster = scrubs
    ? 'img/landscape-last-frame.jpg'
    : 'img/landscape-first-frame.jpg';
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
    playAfterFirstScroll();
    return;
  }

  // --------------------------------------------------------------------------
  // Handy und Tablet: nach dem ersten Scrollen abspielen, sobald es im Bild ist
  // --------------------------------------------------------------------------
  // Bewusst ohne IntersectionObserver. Der Anstoss ist ohnehin das Scrollen, und
  // was sichtbar ist, verrät getBoundingClientRect genauso. Damit hängt der
  // ganze Zweig an nichts, was ein älteres Handy nicht könnte: Wer ein Video
  // abspielen kann, kann das hier auch.
  function playAfterFirstScroll() {
    let done = false;

    // Am Ende auf dem letzten Bild stehen bleiben, genau wie am Scrollrad, und
    // nicht bei jedem Vorbeiscrollen von vorn anfangen.
    video.addEventListener('ended', function () {
      done = true;
      detach();
    });

    // Ein gutes Drittel muss zu sehen sein, sonst liefe das Video, während davon
    // nur ein Streifen am unteren Rand steht. Bei einem Abschnitt, der höher ist
    // als das Fenster, zählt der Bildschirm als Massstab, sonst käme das Drittel
    // nie zusammen.
    function visibleEnough() {
      const box = section.getBoundingClientRect();
      const screen = window.innerHeight;
      const shown = Math.min(box.bottom, screen) - Math.max(box.top, 0);
      return shown > 0 && shown >= Math.min(box.height, screen) * 0.35;
    }

    function onScroll() {
      if (done) return;
      if (visibleEnough()) {
        if (video.paused) {
          // Schlägt fehl, wenn der Browser das Abspielen verweigert, etwa im
          // Stromsparmodus. Dann bleibt einfach das Standbild stehen, deshalb
          // wird der Fehler geschluckt statt in der Konsole zu landen.
          const started = video.play();
          if (started && started.catch) started.catch(function () {});
        }
      } else if (!video.paused) {
        // Aus dem Bild gescrollt: anhalten, aber die Stelle behalten.
        video.pause();
      }
    }

    function detach() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Hier steht mit Absicht kein erster Aufruf von onScroll. Solange nicht
    // gescrollt wurde, läuft nichts, auch wenn vom Video beim Aufsetzen schon
    // ein Stück zu sehen ist.
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
