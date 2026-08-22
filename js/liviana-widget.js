/* ==========================================================================
   Liviana chat widget
   Baut das schwebende Chat-Widget zur Laufzeit auf und hängt es an <body>.
   Die kommerziellen Seiten binden nur css/liviana-widget.css und diese Datei
   ein, es gibt kein Markup zum Kopieren.

   Die Antworten kommen von der Liviana-API (Repo kettenki-liviana, Vertrag in
   dessen API.md). Mit ?mock=true antwortet stattdessen ein lokaler Mock.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Konfiguration. Alles, was sich ohne Codeänderung verschieben können soll,
     steht hier oben und nirgends sonst im Code.
     ------------------------------------------------------------------------ */
  const LIVIANA_CONFIG = {
    endpoint: 'https://mr3w04rnrf.execute-api.eu-central-1.amazonaws.com/chat',
    contactEmail: 'info@kettenki.com',
    // Serverseitiges Limit laut API.md: alles darüber wird gekürzt, nicht abgelehnt.
    maxMessageLength: 1000,
    // API Gateway bricht die Integration nach 26 Sekunden ab, laut API.md soll
    // das Widget bis 30 Sekunden warten.
    timeoutMs: 30000,
    // Ein 502 ist laut API.md vorübergehend, ein zweiter Versuch ist erlaubt.
    upstreamRetryDelayMs: 2000,
    sessionStorageKey: 'liviana-session',
    // Bilder der Maskottchen, pro Sprache. Die Auswahl läuft über die
    // data-i18n-src-Keys in js/translations.js, hier stehen nur die Fallbacks
    // für den Fall, dass translations.js nicht geladen ist.
    fallbackImage: 'img/ketten_liviana_de.jpg'
  };

  // Mock-Modus: ausschliesslich über ?mock=true, nicht automatisch auf
  // localhost. Grund: das Widget muss sich lokal auch gegen die echte API
  // testen lassen, und ein stiller Mock würde genau das verstecken.
  const useMock = new URLSearchParams(window.location.search).get('mock') === 'true';

  /* ------------------------------------------------------------------------
     Übersetzungen. Greift auf dasselbe translations.js zu wie der Rest der
     Seite; statische Texte laufen über data-i18n, dynamische über t().
     ------------------------------------------------------------------------ */
  function currentLanguage() {
    if (typeof currentLang === 'string') return currentLang;
    return localStorage.getItem('preferredLanguage') || 'de';
  }

  function t(key, replacements) {
    let value = key;
    if (typeof translations !== 'undefined') {
      const lang = currentLanguage();
      const dict = translations[lang] || translations.de;
      if (dict && dict[key]) value = dict[key];
    }
    if (replacements) {
      Object.keys(replacements).forEach(name => {
        value = value.replace('{' + name + '}', replacements[name]);
      });
    }
    return value;
  }

  function refreshTranslations() {
    if (typeof updateContent === 'function') updateContent();
  }

  /* ------------------------------------------------------------------------
     Aufbau
     ------------------------------------------------------------------------ */
  const SEND_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  const MARKUP = `
    <button type="button" class="liviana-fab" aria-expanded="false" aria-controls="liviana-panel"
            data-i18n-aria-label="chat_open_label" aria-label="Chat mit Liviana öffnen">
      <img class="liviana-fab-src" src="${LIVIANA_CONFIG.fallbackImage}" alt=""
           data-i18n-src="chat_widget_img" data-i18n-alt="chat_widget_alt">
    </button>

    <div class="liviana-panel" id="liviana-panel" role="dialog"
         aria-labelledby="liviana-panel-title" hidden>
      <div class="liviana-panel-header">
        <span class="liviana-avatar-wrap">
          <img class="liviana-avatar" src="${LIVIANA_CONFIG.fallbackImage}" alt=""
               data-i18n-src="chat_widget_img" data-i18n-alt="chat_widget_alt">
        </span>
        <span class="liviana-panel-heading">
          <span class="liviana-panel-title" id="liviana-panel-title" data-i18n="chat_title">Liviana</span>
          <span class="liviana-panel-subtitle" data-i18n="chat_subtitle">KI-Assistentin von KettenKI</span>
        </span>
        <button type="button" class="liviana-close" data-i18n-aria-label="chat_close_label"
                aria-label="Chat schließen">&times;</button>
      </div>

      <div class="liviana-messages" role="log" aria-live="polite" aria-atomic="false"></div>

      <form class="liviana-composer" novalidate>
        <label class="liviana-visually-hidden" for="liviana-input" data-i18n="chat_input_label">Ihre Nachricht an Liviana</label>
        <textarea class="liviana-input" id="liviana-input" rows="1"
                  maxlength="${LIVIANA_CONFIG.maxMessageLength}"
                  data-i18n-placeholder="chat_input_placeholder"
                  placeholder="Ihre Frage ..."></textarea>
        <button type="submit" class="liviana-send" data-i18n-aria-label="chat_send_label"
                aria-label="Nachricht senden">${SEND_ICON}</button>
      </form>

      <p class="liviana-disclaimer" data-i18n="chat_disclaimer">
        Prototyp. Antworten können Fehler enthalten.
      </p>
    </div>
  `;

  const widget = document.createElement('div');
  widget.className = 'liviana-widget';
  widget.setAttribute('data-state', 'closed');
  widget.innerHTML = MARKUP;

  const fab = widget.querySelector('.liviana-fab');
  const fabSource = widget.querySelector('.liviana-fab-src');
  const panel = widget.querySelector('.liviana-panel');
  const closeBtn = widget.querySelector('.liviana-close');
  const messages = widget.querySelector('.liviana-messages');
  const form = widget.querySelector('.liviana-composer');
  const input = widget.querySelector('.liviana-input');
  const sendBtn = widget.querySelector('.liviana-send');

  let greeted = false;
  let busy = false;
  let cooldownTimer = null;

  /* ------------------------------------------------------------------------
     Maskottchen freistellen

     Beide Bildfassungen zeigen die Figur auf einer deckend schwarzen Fläche.
     Als schwebender Auslöser stünde die Figur damit in einem sichtbaren
     Rechteck, auf der Seitenfläche (#0a0a0a) wie erst recht über dem
     Fussbereich (#131313).

     mix-blend-mode: screen wäre die kurze Lösung und funktioniert auch, aber
     nicht hier: ein Element mit position: fixed isoliert die Mischung in
     Chrome, geblendet wird dann gegen den Knopf statt gegen die Seite. Über
     dem Fussbereich bleibt das Rechteck deshalb stehen (nachgemessen, mit
     eingefärbtem Fussbereich gegengeprüft).

     Also einmalig zur Laufzeit freistellen: Flutfüllung vom Bildrand aus, sie
     stoppt an der durchgehenden hellen Kontur der Figur. Dadurch bleiben die
     dunklen Flächen im Körper erhalten, die eine reine Helligkeitsschwelle
     durchlöchern würde. Ergebnis ist ein Canvas mit echtem Alphakanal, das
     über jedem Untergrund funktioniert.
     ------------------------------------------------------------------------ */

  // Alles bis einschliesslich dieses Wertes gilt als Hintergrund. Die Fläche
  // liegt bei 0 bis 2; der Spielraum nach oben fängt die Artefakte der
  // JPEG-Fassung entlang der Konturen ab.
  const BACKGROUND_THRESHOLD = 34;

  // Gerechnet wird auf einer verkleinerten Fassung. Der Auslöser ist höchstens
  // 116 CSS-Pixel hoch, 256 Bildpunkte reichen also auch auf Retina-Schirmen.
  // Auf der Originalgrösse der deutschen Fassung (1024 x 1008) dauert die
  // Flutfüllung rund 130 ms, verkleinert rund 18 ms, bei praktisch gleichem
  // Ergebnis (freigestellte Fläche 64.8 statt 65.1 Prozent). Der Unterschied
  // fällt beim Seitenaufbau an, deshalb die kleinere Fassung.
  const CUTOUT_HEIGHT = 256;

  const cutoutCache = new Map();

  function clearBackground(imageData, width, height) {
    const px = imageData.data;
    const total = width * height;
    const visited = new Uint8Array(total);
    const stack = new Int32Array(total);
    let top = 0;

    function seed(index) {
      if (visited[index]) return;
      const at = index * 4;
      if (px[at] > BACKGROUND_THRESHOLD || px[at + 1] > BACKGROUND_THRESHOLD || px[at + 2] > BACKGROUND_THRESHOLD) return;
      visited[index] = 1;
      stack[top++] = index;
    }

    for (let x = 0; x < width; x++) {
      seed(x);
      seed((height - 1) * width + x);
    }
    for (let y = 0; y < height; y++) {
      seed(y * width);
      seed(y * width + width - 1);
    }

    while (top > 0) {
      const index = stack[--top];
      px[index * 4 + 3] = 0;
      const x = index % width;
      const y = (index - x) / width;
      if (x > 0) seed(index - 1);
      if (x < width - 1) seed(index + 1);
      if (y > 0) seed(index - width);
      if (y < height - 1) seed(index + width);
    }
  }

  function cutout(src) {
    if (cutoutCache.has(src)) return cutoutCache.get(src);

    const job = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, CUTOUT_HEIGHT / image.naturalHeight);
        const width = Math.round(image.naturalWidth * scale);
        const height = Math.round(image.naturalHeight * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, 0, 0, width, height);
        const data = context.getImageData(0, 0, width, height);
        clearBackground(data, width, height);
        context.putImageData(data, 0, 0);
        resolve(canvas);
      };
      image.onerror = reject;
      image.src = src;
    });

    cutoutCache.set(src, job);
    return job;
  }

  let renderToken = 0;

  // Zeichnet die freigestellte Fassung der aktuell eingestellten Sprache.
  // Schlägt das fehl, bleibt es beim Bild mit schwarzer Fläche: sichtbar
  // schlechter, aber immer noch ein funktionierender Auslöser.
  function renderMascot() {
    const src = fabSource.getAttribute('src');
    if (!src) return;
    const token = ++renderToken;

    cutout(src).then(canvas => {
      if (token !== renderToken) return;
      const art = document.createElement('canvas');
      art.className = 'liviana-fab-art';
      art.width = canvas.width;
      art.height = canvas.height;
      art.getContext('2d').drawImage(canvas, 0, 0);
      art.setAttribute('aria-hidden', 'true');
      const previous = fab.querySelector('.liviana-fab-art');
      if (previous) previous.remove();
      fab.appendChild(art);
      requestAnimationFrame(() => art.classList.add('is-ready'));
      // Sicherheitsnetz: läuft in einem gedrosselten Dokument kein Frame, wird
      // die Klasse trotzdem gesetzt.
      setTimeout(() => art.classList.add('is-ready'), 60);
    }).catch(() => {
      fabSource.style.display = 'block';
      fabSource.style.height = '100%';
      fabSource.style.width = 'auto';
    });
  }

  // Die Sprache wechselt das src-Attribut über data-i18n-src in
  // js/translations.js. Statt setLanguage zu umwickeln wird genau dieses
  // Attribut beobachtet: das Widget hängt sich damit an das bestehende
  // i18n-System an, ohne es zu kennen.
  new MutationObserver(renderMascot).observe(fabSource, {
    attributes: true,
    attributeFilter: ['src']
  });

  /* ------------------------------------------------------------------------
     Nachrichten
     ------------------------------------------------------------------------ */
  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  // Fügt eine Blase ein. i18nKey (optional) sorgt dafür, dass fest formulierte
  // Texte beim Sprachwechsel mitübersetzt werden; freie Texte (Antwort der API,
  // Eingabe des Besuchers) bekommen keinen Key und bleiben stehen, wie sie sind.
  function addMessage(text, variant, i18nKey) {
    const bubble = document.createElement('div');
    bubble.className = 'liviana-msg liviana-msg--' + variant;
    bubble.textContent = text;
    if (i18nKey) bubble.setAttribute('data-i18n', i18nKey);
    messages.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function addErrorMessage(i18nKey, withContact) {
    const bubble = document.createElement('div');
    bubble.className = 'liviana-msg liviana-msg--system';

    const span = document.createElement('span');
    span.setAttribute('data-i18n', i18nKey);
    span.textContent = t(i18nKey);
    bubble.appendChild(span);

    if (withContact) {
      bubble.appendChild(document.createTextNode(' '));
      const link = document.createElement('a');
      link.href = 'mailto:' + LIVIANA_CONFIG.contactEmail;
      link.textContent = LIVIANA_CONFIG.contactEmail;
      bubble.appendChild(link);
    }

    messages.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'liviana-typing';
    el.setAttribute('aria-label', t('chat_typing'));
    el.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(el);
    scrollToBottom();
    return el;
  }

  function greet() {
    if (greeted) return;
    greeted = true;
    addMessage(t('chat_greeting'), 'bot', 'chat_greeting');
  }

  /* ------------------------------------------------------------------------
     Öffnen und schliessen
     ------------------------------------------------------------------------ */
  function openPanel() {
    if (widget.getAttribute('data-state') === 'open') return;
    panel.hidden = false;
    widget.setAttribute('data-state', 'open');
    fab.setAttribute('aria-expanded', 'true');
    greet();
    if (window.matchMedia('(min-width: 601px)').matches) input.focus();
  }

  function closePanel() {
    widget.setAttribute('data-state', 'closed');
    fab.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    fab.focus();
  }

  fab.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && widget.getAttribute('data-state') === 'open') {
      closePanel();
    }
  });

  /* ------------------------------------------------------------------------
     Eingabefeld: wächst mit dem Text, Enter sendet, Shift+Enter macht Umbruch
     ------------------------------------------------------------------------ */
  function autoGrow() {
    input.style.height = 'auto';
    const target = Math.min(input.scrollHeight, 96);
    input.style.height = target + 'px';
    // Erst ab der Maximalhöhe darf gescrollt werden. Ohne das erscheint schon
    // bei einer Zeile eine Bildlaufleiste, weil scrollHeight und gesetzte Höhe
    // sich um ein Pixel unterscheiden können.
    input.style.overflowY = input.scrollHeight > 96 ? 'auto' : 'hidden';
  }

  input.addEventListener('input', autoGrow);

  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  function setBusy(value) {
    busy = value;
    sendBtn.disabled = value;
    input.disabled = value;
  }

  /* ------------------------------------------------------------------------
     Mock-Transport (Phase 1)
     Antwortet wie die echte API: entweder { answer } oder ein Fehlerobjekt.
     Ein paar Schlüsselwörter lösen gezielt die Fehlerzustände aus, damit sich
     alle Zustände maquettieren und ansehen lassen, ohne die API zu belasten.
     ------------------------------------------------------------------------ */
  const MOCK_ANSWERS = {
    de: {
      bambera: 'BAMBERA digitalisiert Betriebshandbücher und macht daraus eine Assistentin, die Ihr Team in natürlicher Sprache fragen kann. Gedacht für Gastronomie, Industrie und Kinderbetreuung.',
      liviana: 'Das bin ich. LIVIANA beantwortet Kundenanfragen auf Ihrer Website rund um die Uhr, in mehreren Sprachen. Was Sie gerade sehen, ist genau dieses Produkt im Einsatz.',
      fandango: 'FANDANGO automatisiert wiederkehrende Abläufe, damit Ihr Team sich auf die Arbeit konzentrieren kann, die wirklich Aufmerksamkeit braucht.',
      kontakt: 'Am schnellsten geht es per E-Mail an info@kettenki.com. Sie erreichen uns auch über das Kontaktformular auf dieser Seite.',
      preis: 'Unsere Prototypen haben keine öffentliche Preisliste. Sie sind kostenlos zum Testen, und bei Erfolg sprechen wir über die gemeinsame Weiterentwicklung. Schreiben Sie an info@kettenki.com.',
      default: 'KettenKI baut experimentelle KI-Prototypen für Schweizer Unternehmen: kostenlos testen, bei Erfolg gemeinsam skalieren. Fragen Sie mich gern nach BAMBERA, LIVIANA oder FANDANGO.'
    },
    en: {
      bambera: 'BAMBERA turns operating manuals into an assistant your team can ask in plain language. Built for hospitality, industry and childcare.',
      liviana: 'That is me. LIVIANA answers customer questions on your website around the clock, in several languages. What you are looking at right now is the product itself.',
      fandango: 'FANDANGO automates repetitive workflows so your team can focus on the work that actually needs attention.',
      kontakt: 'The quickest way is an email to info@kettenki.com. You can also use the contact form on this site.',
      preis: 'Our prototypes have no public price list. They are free to test, and if they work out we talk about scaling them together. Write to info@kettenki.com.',
      default: 'KettenKI builds experimental AI prototypes for Swiss companies: test them for free, scale together on success. Ask me about BAMBERA, LIVIANA or FANDANGO.'
    }
  };

  function mockAsk(message) {
    const text = message.toLowerCase();
    const delay = 700 + Math.random() * 900;

    return new Promise(resolve => {
      setTimeout(() => {
        if (text.includes('429') || text.includes('ratelimit')) {
          resolve({ error: 'rate_limited', retryAfter: 12 });
          return;
        }
        if (text.includes('503') || text.includes('budget')) {
          resolve({ error: 'budget_exhausted' });
          return;
        }
        if (text.includes('502') || text.includes('500') || text.includes('fehler')) {
          resolve({ error: 'upstream_error' });
          return;
        }

        const dict = MOCK_ANSWERS[currentLanguage()] || MOCK_ANSWERS.de;
        let key = 'default';
        if (text.includes('bambera')) key = 'bambera';
        else if (text.includes('liviana') || text.includes('du') || text.includes('you')) key = 'liviana';
        else if (text.includes('fandango')) key = 'fandango';
        else if (text.includes('kontakt') || text.includes('contact') || text.includes('mail')) key = 'kontakt';
        else if (text.includes('preis') || text.includes('kost') || text.includes('price')) key = 'preis';

        resolve({ answer: dict[key] });
      }, delay);
    });
  }

  /* ------------------------------------------------------------------------
     Sitzung

     Der Server setzt keine Cookies und erkennt eine wiederkehrende Besucherin
     ausschliesslich an dieser Kennung. Sie liegt bewusst in localStorage und
     nicht in sessionStorage: das Gespräch soll ein Neuladen der Seite und einen
     Wechsel zwischen den Seiten überleben. Serverseitig verfällt die Erinnerung
     ohnehin nach 24 Stunden, eine alte Kennung beginnt dann einfach von vorn.
     Der Verlauf selbst bleibt beim Server, das Widget schickt immer nur die
     neue Nachricht.
     ------------------------------------------------------------------------ */

  const SESSION_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
  let sessionFallback = null;

  function newSessionId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID().replace(/-/g, '');
    }
    // Ältere Browser ohne randomUUID: dieselbe Form aus Zufallsbytes.
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  function readStoredSession() {
    try {
      return localStorage.getItem(LIVIANA_CONFIG.sessionStorageKey);
    } catch (error) {
      return null;
    }
  }

  function storeSession(id) {
    try {
      localStorage.setItem(LIVIANA_CONFIG.sessionStorageKey, id);
    } catch (error) {
      // Privates Fenster oder gesperrter Speicher: die Kennung hält dann nur
      // solange die Seite offen ist. Der Chat funktioniert trotzdem.
      sessionFallback = id;
    }
  }

  function sessionId() {
    let id = readStoredSession() || sessionFallback;
    if (!id || !SESSION_PATTERN.test(id)) {
      id = newSessionId();
      sessionFallback = id;
      storeSession(id);
    }
    return id;
  }

  /* ------------------------------------------------------------------------
     Aufruf der API
     ------------------------------------------------------------------------ */

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function apiAsk(message, isRetry) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), LIVIANA_CONFIG.timeoutMs);

    let response;
    try {
      response = await fetch(LIVIANA_CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message, sessionId: sessionId() }),
        signal: controller.signal
      });
    } catch (error) {
      clearTimeout(timeout);
      // Abgebrochen heisst hier: die 30 Sekunden sind um. Alles andere ist ein
      // Netzwerkfehler, auch eine von CORS abgewiesene Antwort landet hier.
      return { error: controller.signal.aborted ? 'timeout' : 'offline' };
    }
    clearTimeout(timeout);

    let body = null;
    try {
      body = await response.json();
    } catch (error) {
      body = null;
    }

    if (response.ok && body && body.answer) {
      if (body.sessionId) storeSession(body.sessionId);
      return {
        answer: body.answer,
        truncated: !!(body.meta && body.meta.messageTruncated)
      };
    }

    if (response.status === 502 && !isRetry) {
      await wait(LIVIANA_CONFIG.upstreamRetryDelayMs);
      return apiAsk(message, true);
    }

    // body.message ist englischer Entwicklertext und wird bewusst nicht
    // angezeigt; verzweigt wird allein über body.error.
    const retryAfter = Number(body && body.retryAfter) ||
      Number(response.headers.get('Retry-After')) || 0;

    return {
      error: (body && body.error) || 'internal_error',
      retryAfter: retryAfter
    };
  }

  function ask(message) {
    if (useMock) return mockAsk(message);
    return apiAsk(message, false);
  }

  /* ------------------------------------------------------------------------
     Fehlerbehandlung
     ------------------------------------------------------------------------ */
  function startCooldown(seconds) {
    let remaining = Math.max(1, Math.round(seconds));
    setBusy(true);

    const note = document.createElement('div');
    note.className = 'liviana-msg liviana-msg--note';
    note.textContent = t('chat_cooldown', { seconds: remaining });
    messages.appendChild(note);
    scrollToBottom();

    clearInterval(cooldownTimer);
    cooldownTimer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(cooldownTimer);
        cooldownTimer = null;
        note.remove();
        setBusy(false);
        input.focus();
        return;
      }
      note.textContent = t('chat_cooldown', { seconds: remaining });
    }, 1000);
  }

  function handleError(result) {
    switch (result.error) {
      case 'rate_limited':
        addErrorMessage('chat_error_rate_limited', false);
        startCooldown(result.retryAfter || 60);
        break;
      case 'budget_exhausted':
        addErrorMessage('chat_error_budget', true);
        break;
      case 'bad_request':
        addErrorMessage('chat_error_bad_request', false);
        break;
      case 'offline':
        addErrorMessage('chat_error_offline', false);
        break;
      case 'timeout':
        addErrorMessage('chat_error_timeout', false);
        break;
      default:
        addErrorMessage('chat_error_generic', true);
    }
  }

  /* ------------------------------------------------------------------------
     Senden
     ------------------------------------------------------------------------ */
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;

    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';
    autoGrow();
    setBusy(true);

    const typing = showTyping();

    let result;
    try {
      result = await ask(message);
    } catch (error) {
      result = { error: 'internal_error' };
    }

    typing.remove();

    if (result && result.answer) {
      addMessage(result.answer, 'bot');
      if (result.truncated) {
        addMessage(t('chat_truncated'), 'note', 'chat_truncated');
      }
      setBusy(false);
      input.focus();
    } else {
      handleError(result || {});
      // Bei einer Sperre übernimmt startCooldown das Freigeben.
      if (!result || result.error !== 'rate_limited') {
        setBusy(false);
        input.focus();
      }
    }
  });

  /* ------------------------------------------------------------------------
     Einhängen
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    // Das Widget gehört zum dunklen, kommerziellen Teil der Seite. contact.html
    // wechselt mit ?from=portfolio bzw. ?from=blog auf das helle Thema und
    // bedient dann Portfolio- und Blog-Publikum, für das es hier bewusst kein
    // Widget gibt. js/contact-nav.js setzt die Klasse synchron beim Skriptstart,
    // sie steht hier also bereits fest.
    if (document.body.classList.contains('theme-light')) return;

    document.body.appendChild(widget);
    document.body.classList.add('has-liviana');
    // translations.js hat seinen Durchlauf zu diesem Zeitpunkt schon hinter
    // sich, die frisch erzeugten Knoten waren dabei noch nicht im DOM.
    // Gleiches Muster wie blog-filter.js und contact-nav.js.
    refreshTranslations();
    renderMascot();
    autoGrow();
  });
})();
