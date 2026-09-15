/* Terminbuchung. Attrappe, aber mit echtem Ablauf.
   Nichts geht an einen Server: Die freien Zeiten werden aus dem Datum
   berechnet, damit derselbe Tag immer dieselben Lücken zeigt, und der
   gebuchte Termin landet im localStorage, wo ihn der Lernbereich abholt. */

(function () {
  'use strict';

  const KINDS = [
    { id: 'probe', name: 'Probelektion', minutes: 25, price: 0, note: 'Kennenlernen, Einstufung, offene Fragen' },
    { id: 'einzel', name: 'Einzellektion', minutes: 60, price: 85, note: 'Unterricht allein, Thema nach Wunsch' },
    { id: 'konversation', name: 'Konversationsstunde', minutes: 45, price: 65, note: 'nur sprechen, mit Korrektur am Schluss' },
  ];

  const BOOKING_KEY = 'sprachwerk-termin';
  const DAY_MS = 86400000;

  const state = {
    kind: KINDS[0],
    day: null,
    time: null,
    online: false,
  };

  const el = {
    kinds: document.querySelector('[data-kinds]'),
    weekLabel: document.querySelector('[data-week-label]'),
    prev: document.querySelector('[data-week="-1"]'),
    next: document.querySelector('[data-week="1"]'),
    days: document.querySelector('[data-days]'),
    slotsHead: document.querySelector('[data-slots-head]'),
    slotsCount: document.querySelector('[data-slots-count]'),
    slots: document.querySelector('[data-slots]'),
    summary: document.querySelector('[data-summary]'),
    goForm: document.querySelector('[data-go-form]'),
    formPanel: document.querySelector('[data-form-panel]'),
    form: document.querySelector('[data-form]'),
    confirmation: document.querySelector('[data-confirmation]'),
    flow: document.querySelector('[data-flow]'),
    stepper: document.querySelectorAll('[data-step]'),
  };

  if (!el.days) return;

  /* ---------- Datum ---------- */

  const fmtDayName = new Intl.DateTimeFormat('de-CH', { weekday: 'short' });
  const fmtLong = new Intl.DateTimeFormat('de-CH', { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtRange = new Intl.DateTimeFormat('de-CH', { day: 'numeric', month: 'short' });

  function startOfDay(date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function addDays(date, count) {
    return new Date(date.getTime() + count * DAY_MS);
  }

  function isoDay(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

  const today = startOfDay(new Date());

  /* Die Woche beginnt am Montag; wir zeigen immer Montag bis Samstag. */
  function mondayOf(date) {
    const day = (date.getDay() + 6) % 7;
    return addDays(startOfDay(date), -day);
  }

  let weekStart = mondayOf(today);

  /* ---------- Freie Zeiten ---------- */

  /* Eine kleine, stabile Streuung: gleiche Zeichenkette, gleiche Zahl. */
  function hash(text) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      value ^= text.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    return (value >>> 0) / 4294967295;
  }

  function slotsFor(date, kind) {
    const weekday = date.getDay();
    if (weekday === 0) return [];                       // Sonntag geschlossen

    const openings = weekday === 6
      ? ['09:00', '10:00', '11:00', '12:00']            // Samstagvormittag
      : ['08:00', '09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30'];

    return openings.map(function (time) {
      const seed = hash(isoDay(date) + time + kind.id);
      const past = date.getTime() < today.getTime();
      /* Der heutige Tag verliert die Zeiten, die schon vorbei sind. */
      const now = new Date();
      const isToday = isoDay(date) === isoDay(now);
      const tooLate = isToday && Number(time.slice(0, 2)) <= now.getHours() + 1;
      return { time: time, free: !past && !tooLate && seed > 0.42 };
    });
  }

  function freeCount(date) {
    return slotsFor(date, state.kind).filter((slot) => slot.free).length;
  }

  /* ---------- Zeichnen ---------- */

  function renderKinds() {
    el.kinds.innerHTML = KINDS.map(function (kind) {
      const price = kind.price === 0 ? 'gratis' : 'CHF ' + kind.price;
      return (
        '<button class="kind" type="button" data-kind="' + kind.id + '"' +
        ' aria-pressed="' + (kind.id === state.kind.id) + '">' +
          '<span class="kind__radio" aria-hidden="true"></span>' +
          '<span>' +
            '<span class="kind__name">' + kind.name + '</span><br>' +
            '<span class="kind__meta">' + kind.minutes + ' Minuten, ' + kind.note + '</span>' +
          '</span>' +
          '<span class="kind__price">' + price + '</span>' +
        '</button>'
      );
    }).join('');
  }

  function renderWeek() {
    const end = addDays(weekStart, 5);
    el.weekLabel.textContent = fmtRange.format(weekStart) + ' – ' + fmtRange.format(end);
    el.prev.disabled = weekStart.getTime() <= mondayOf(today).getTime();

    let html = '';
    for (let i = 0; i < 6; i += 1) {
      const date = addDays(weekStart, i);
      const free = freeCount(date);
      const past = date.getTime() < today.getTime();
      const selected = state.day && isoDay(state.day) === isoDay(date);
      html +=
        '<button class="day" type="button" data-day="' + isoDay(date) + '"' +
        ' aria-pressed="' + Boolean(selected) + '"' + (past || free === 0 ? ' disabled' : '') + '>' +
          '<span class="day__name">' + fmtDayName.format(date) + '</span>' +
          '<span class="day__num">' + date.getDate() + '</span>' +
          '<span class="day__free">' + (past ? 'vorbei' : free === 0 ? 'belegt' : free + ' frei') + '</span>' +
        '</button>';
    }
    el.days.innerHTML = html;
  }

  function renderSlots() {
    if (!state.day) {
      el.slotsHead.textContent = 'Wähle zuerst einen Tag';
      el.slotsCount.textContent = '';
      el.slots.innerHTML = '<p class="slots-empty">Die freien Zeiten erscheinen, sobald du oben einen Tag ausgewählt hast.</p>';
      return;
    }

    const list = slotsFor(state.day, state.kind);
    const free = list.filter((slot) => slot.free).length;
    el.slotsHead.textContent = fmtLong.format(state.day);
    el.slotsCount.textContent = free + ' von ' + list.length + ' Zeiten frei, alle Angaben in Ortszeit Bern';

    el.slots.innerHTML = list.map(function (slot) {
      const selected = state.time === slot.time;
      return (
        '<button class="slot" type="button" data-slot="' + slot.time + '"' +
        ' aria-pressed="' + selected + '"' + (slot.free ? '' : ' disabled aria-label="' + slot.time + ' bereits vergeben"') + '>' +
          slot.time +
        '</button>'
      );
    }).join('');
  }

  function renderSummary() {
    const kind = state.kind;
    const price = kind.price === 0 ? 'gratis' : 'CHF ' + kind.price;
    const when = state.day && state.time
      ? fmtLong.format(state.day) + ', ' + state.time + ' Uhr'
      : 'noch offen';

    el.summary.innerHTML =
      '<div><dt>Art</dt><dd>' + kind.name + '</dd></div>' +
      '<div><dt>Dauer</dt><dd>' + kind.minutes + ' Minuten</dd></div>' +
      '<div><dt>Termin</dt><dd>' + when + '</dd></div>' +
      '<div><dt>Ort</dt><dd>' + (state.online ? 'Online' : 'Effingerstrasse 12') + '</dd></div>' +
      '<div><dt>Preis</dt><dd>' + price + '</dd></div>';

    el.goForm.disabled = !(state.day && state.time);
    markStep(state.day && state.time ? 2 : 1);
  }

  function markStep(current) {
    el.stepper.forEach(function (item) {
      const step = Number(item.dataset.step);
      item.toggleAttribute('data-active', step === current);
      item.toggleAttribute('data-done', step < current);
    });
  }

  function render() {
    renderKinds();
    renderWeek();
    renderSlots();
    renderSummary();
  }

  /* ---------- Bedienung ---------- */

  el.kinds.addEventListener('click', function (event) {
    const button = event.target.closest('[data-kind]');
    if (!button) return;
    state.kind = KINDS.find((kind) => kind.id === button.dataset.kind);
    state.time = null;          // andere Dauer, andere freie Zeiten
    render();
  });

  el.days.addEventListener('click', function (event) {
    const button = event.target.closest('[data-day]');
    if (!button || button.disabled) return;
    const parts = button.dataset.day.split('-').map(Number);
    state.day = new Date(parts[0], parts[1] - 1, parts[2]);
    state.time = null;
    render();
  });

  el.slots.addEventListener('click', function (event) {
    const button = event.target.closest('[data-slot]');
    if (!button || button.disabled) return;
    state.time = button.dataset.slot;
    renderSlots();
    renderSummary();
  });

  el.prev.addEventListener('click', function () {
    weekStart = addDays(weekStart, -7);
    render();
  });

  el.next.addEventListener('click', function () {
    weekStart = addDays(weekStart, 7);
    render();
  });

  document.querySelector('[data-online]').addEventListener('change', function (event) {
    state.online = event.target.checked;
    renderSummary();
  });

  el.goForm.addEventListener('click', function () {
    el.formPanel.hidden = false;
    markStep(3);
    el.formPanel.scrollIntoView({ block: 'start', behavior: 'smooth' });
    const first = el.formPanel.querySelector('input');
    if (first) window.setTimeout(() => first.focus({ preventScroll: true }), 400);
  });

  el.form.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(el.form);
    const booking = {
      kind: state.kind.name,
      minutes: state.kind.minutes,
      price: state.kind.price,
      day: isoDay(state.day),
      dayLabel: fmtLong.format(state.day),
      time: state.time,
      online: state.online,
      name: (data.get('vorname') || '') + ' ' + (data.get('nachname') || ''),
      savedAt: Date.now(),
    };

    try {
      localStorage.setItem(BOOKING_KEY, JSON.stringify(booking));
    } catch (err) {
      /* Privates Fenster: dann sieht der Lernbereich eben den Beispieltermin. */
    }

    el.flow.hidden = true;
    el.confirmation.hidden = false;
    /* Die Auswahl rechts hat ihren Zweck erfüllt; sie stünde sonst neben der
       Bestätigung und lüde zum zweiten Mal zum Buchen ein. */
    document.querySelector('.summary').hidden = true;
    markStep(4);

    el.confirmation.querySelector('[data-c-kind]').textContent = booking.kind;
    el.confirmation.querySelector('[data-c-when]').textContent = booking.dayLabel + ', ' + booking.time + ' Uhr';
    el.confirmation.querySelector('[data-c-where]').textContent = booking.online ? 'Online (Link folgt per E-Mail)' : 'Effingerstrasse 12, 3011 Bern';
    el.confirmation.querySelector('[data-c-price]').textContent = booking.price === 0 ? 'gratis' : 'CHF ' + booking.price;
    el.confirmation.querySelector('[data-c-name]').textContent = booking.name.trim() || 'Gast';
    el.confirmation.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  render();
})();
