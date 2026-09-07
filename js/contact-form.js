/* Kontaktformular.
 *
 * Bis zum 2026-09-07 bot die Kontaktseite nur einen mailto-Link und LinkedIn.
 * Das ist der Zielpunkt der ganzen kommerziellen Seite und war zugleich ihre
 * schwächste Stelle: mailto öffnet auf vielen Handys gar nichts, und wer doch
 * schreibt, weiss nicht, was wir wissen müssen.
 *
 * Der Versand läuft seit dem 2026-09-07 über eine eigene Lambda: HTTP API →
 * Lambda → SES, Stack `kettenki-contact` im Repo kettenki-liviana
 * (infra/contact.yaml). Die Anfrage landet im Postfach info@kettenki.com, mit
 * der Adresse der Absenderin im Reply-To — Antworten geht also direkt an sie.
 *
 * Wie beim Chat-Widget gilt: AllowedOrigin der API steht auf
 * https://kettenki.com. **Von localhost antwortet sie nicht.** Das ist kein
 * Fehler, sondern der Schutz davor, dass eine fremde Seite ins Postfach
 * schreibt. Zum Maquettieren genügt es, ENDPOINT hier leer zu setzen: dann
 * greift der Rückfall unten und öffnet eine vorbereitete E-Mail.
 *
 * Der Rückfall bleibt mit Absicht stehen. Er deckt zwei Fälle ab, die es
 * weiterhin gibt: die lokale Entwicklung und einen Ausfall der API. Was er
 * verhindert, ist der einzige wirklich schlimme Fall — ein Formular, das
 * aussieht, als hätte es gesendet, und die Anfrage in Wahrheit wegwirft.
 */
(function () {
  'use strict';

  var ENDPOINT = 'https://c2smdvb6gk.execute-api.eu-central-1.amazonaws.com/contact';
  var MAILTO = 'info@kettenki.com';

  var PRODUKTE = { liviana: 'LIVIANA', bambera: 'BAMBERA', fandango: 'FANDANGO' };

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contact-form');
    if (!form) return;

    // Im hellen Thema kommt der Besucher aus Portfolio oder Blog, ist also
    // Recruiter und kein Kunde. Dort bleibt es bei E-Mail und LinkedIn, ein
    // Projektbriefing wäre da die falsche Frage. Dieselbe Regel wie beim
    // Chat-Widget, und aus demselben Grund.
    if (document.body.classList.contains('theme-light')) return;

    form.hidden = false;
    var label = document.getElementById('contact-links-label');
    if (label) label.hidden = false;

    // Kommt jemand über "LIVIANA kostenlos testen", steht das Produkt schon
    // fest. Es wird angezeigt und mitgeschickt, statt den Text vorzuschreiben:
    // Was jemand braucht, formuliert er besser selbst.
    var interest = '';
    var wanted = new URLSearchParams(window.location.search).get('produkt');
    if (wanted && Object.prototype.hasOwnProperty.call(PRODUKTE, wanted)) {
      interest = PRODUKTE[wanted];
      document.getElementById('contact-interest-name').textContent = interest;
      document.getElementById('contact-interest').hidden = false;
    }

    var nameField = document.getElementById('cf-name');
    var emailField = document.getElementById('cf-email');
    var companyField = document.getElementById('cf-company');
    var messageField = document.getElementById('cf-message');
    var status = document.getElementById('contact-status');
    var submit = form.querySelector('button[type="submit"]');

    function t(key, fallback) {
      try {
        var lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'de';
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
          return translations[lang][key];
        }
      } catch (e) { /* Übersetzungen nicht geladen: Rückfalltext genügt */ }
      return fallback;
    }

    // Fehler hängen am Feld, nicht in einer Liste am Kopf des Formulars: Wer
    // etwas vergisst, soll sehen wo, ohne zu suchen.
    function setError(field, errorId, show) {
      var el = document.getElementById(errorId);
      if (el) el.hidden = !show;
      field.setAttribute('aria-invalid', show ? 'true' : 'false');
      if (el) field.setAttribute('aria-describedby', show ? errorId : '');
    }

    // Bewusst grosszügig: alles mit @ und einem Punkt dahinter. Strengere
    // Muster weisen echte Adressen ab, und der einzige Preis für eine falsche
    // ist eine Mail, die nicht ankommt — der für eine abgewiesene Anfrage ist
    // ein verlorener Kunde.
    function looksLikeEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validate() {
      var okName = nameField.value.trim().length > 0;
      var okEmail = looksLikeEmail(emailField.value.trim());
      var okMessage = messageField.value.trim().length > 0;
      setError(nameField, 'cf-name-error', !okName);
      setError(emailField, 'cf-email-error', !okEmail);
      setError(messageField, 'cf-message-error', !okMessage);
      if (!okName) nameField.focus();
      else if (!okEmail) emailField.focus();
      else if (!okMessage) messageField.focus();
      return okName && okEmail && okMessage;
    }

    [nameField, emailField, messageField].forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.value.trim()) {
          setError(field, field.id + '-error', false);
        }
      });
    });

    function say(message, kind) {
      status.textContent = message;
      status.hidden = false;
      status.className = 'contact-form-status' + (kind ? ' is-' + kind : '');
    }

    // Ohne Endpunkt: eine fertig ausgefüllte E-Mail öffnen. Die Anfrage liegt
    // dann im Postausgang des Besuchers und nicht im Nichts.
    function fallbackMail(data) {
      var subject = interest
        ? 'Anfrage zu ' + interest + ' — ' + data.name
        : 'Anfrage von ' + data.name;
      var body = [
        data.message,
        '',
        '—',
        'Name: ' + data.name,
        'E-Mail: ' + data.email,
        data.company ? 'Unternehmen: ' + data.company : null,
        interest ? 'Interesse: ' + interest : null
      ].filter(Boolean).join('\n');
      window.location.href = 'mailto:' + MAILTO +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!validate()) return;

      var data = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        company: companyField.value.trim(),
        message: messageField.value.trim(),
        interest: interest,
        lang: (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'de'
      };

      if (!ENDPOINT) {
        fallbackMail(data);
        return;
      }

      submit.disabled = true;
      say(t('contact_form_sending', 'Wird gesendet …'));

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          form.reset();
          say(t('contact_form_sent', 'Danke, deine Anfrage ist angekommen.'), 'ok');
          submit.hidden = true;
        })
        .catch(function () {
          // Nichts verschlucken: Wer hier landet, bekommt den direkten Weg
          // genannt, statt vor einem stummen Formular zu sitzen.
          submit.disabled = false;
          say(t('contact_form_error', 'Das Senden hat nicht geklappt. Schreib uns bitte direkt an ' + MAILTO + '.'), 'error');
        });
    });
  });
})();
