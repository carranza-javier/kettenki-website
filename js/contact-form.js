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
(() => {

  // Der Versand lief einen Abend lang ins Leere: Absender info@kettenki.com,
  // Postfach hinter Zoho, und der SPF der Domain kannte nur Zoho — ohne
  // DKIM-Signatur wies die Gegenseite jede Mail als Fälschung ab. Seit die drei
  // DKIM-CNAMEs im DNS bei INWX stehen, signiert SES für kettenki.com, und die
  // Post landet im Posteingang. Nachgewiesen am 2026-09-07, im Posteingang
  // gesehen — nicht bloss von SES angenommen. Der Unterschied hat den Abend
  // gekostet und steht deshalb hier.
  const ENDPOINT = 'https://c2smdvb6gk.execute-api.eu-central-1.amazonaws.com/contact';
  const MAILTO = 'info@kettenki.com';

  const PRODUKTE = { liviana: 'LIVIANA', bambera: 'BAMBERA', fandango: 'FANDANGO' };

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Im hellen Thema kommt der Besucher aus Portfolio oder Blog, ist also
    // Recruiter und kein Kunde. Dort bleibt es bei E-Mail und LinkedIn, ein
    // Projektbriefing wäre da die falsche Frage. Dieselbe Regel wie beim
    // Chat-Widget, und aus demselben Grund.
    if (document.body.classList.contains('theme-light')) return;

    form.hidden = false;
    const label = document.getElementById('contact-links-label');
    if (label) label.hidden = false;

    // Kommt jemand über "LIVIANA kostenlos testen", steht das Produkt schon
    // fest. Es wird angezeigt und mitgeschickt, statt den Text vorzuschreiben:
    // Was jemand braucht, formuliert er besser selbst.
    let interest = '';
    const wanted = new URLSearchParams(window.location.search).get('produkt');
    if (wanted && Object.prototype.hasOwnProperty.call(PRODUKTE, wanted)) {
      interest = PRODUKTE[wanted];
      document.getElementById('contact-interest-name').textContent = interest;
      document.getElementById('contact-interest').hidden = false;
    }

    const nameField = document.getElementById('cf-name');
    const emailField = document.getElementById('cf-email');
    const companyField = document.getElementById('cf-company');
    const messageField = document.getElementById('cf-message');
    const status = document.getElementById('contact-status');
    const submit = form.querySelector('button[type="submit"]');

    const lang = () => (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'de';

    const t = (key, fallback) => {
      // Übersetzungen nicht geladen: Rückfalltext genügt
      const dict = typeof translations !== 'undefined' ? translations[lang()] : null;
      return (dict && dict[key]) || fallback;
    };

    // Fehler hängen am Feld, nicht in einer Liste am Kopf des Formulars: Wer
    // etwas vergisst, soll sehen wo, ohne zu suchen.
    const setError = (field, errorId, show) => {
      const el = document.getElementById(errorId);
      if (el) el.hidden = !show;
      field.setAttribute('aria-invalid', show ? 'true' : 'false');
      if (el) field.setAttribute('aria-describedby', show ? errorId : '');
    };

    // Bewusst grosszügig: alles mit @ und einem Punkt dahinter. Strengere
    // Muster weisen echte Adressen ab, und der einzige Preis für eine falsche
    // ist eine Mail, die nicht ankommt — der für eine abgewiesene Anfrage ist
    // ein verlorener Kunde.
    const looksLikeEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const validate = () => {
      const okName = nameField.value.trim().length > 0;
      const okEmail = looksLikeEmail(emailField.value.trim());
      const okMessage = messageField.value.trim().length > 0;
      setError(nameField, 'cf-name-error', !okName);
      setError(emailField, 'cf-email-error', !okEmail);
      setError(messageField, 'cf-message-error', !okMessage);
      if (!okName) nameField.focus();
      else if (!okEmail) emailField.focus();
      else if (!okMessage) messageField.focus();
      return okName && okEmail && okMessage;
    };

    [nameField, emailField, messageField].forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) {
          setError(field, field.id + '-error', false);
        }
      });
    });

    const say = (message, kind) => {
      status.textContent = message;
      status.hidden = false;
      status.className = 'contact-form-status' + (kind ? ' is-' + kind : '');
    };

    // Ohne Endpunkt: eine fertig ausgefüllte E-Mail öffnen. Die Anfrage liegt
    // dann im Postausgang des Besuchers und nicht im Nichts.
    const fallbackMail = data => {
      const subject = interest
        ? 'Anfrage zu ' + interest + ' — ' + data.name
        : 'Anfrage von ' + data.name;
      const body = [
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
    };

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validate()) return;

      const data = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        company: companyField.value.trim(),
        message: messageField.value.trim(),
        interest: interest,
        lang: lang()
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
        .then(response => {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          form.reset();
          say(t('contact_form_sent', 'Danke, deine Anfrage ist angekommen.'), 'ok');
          submit.hidden = true;
        })
        .catch(() => {
          // Nichts verschlucken: Wer hier landet, bekommt den direkten Weg
          // genannt, statt vor einem stummen Formular zu sitzen.
          submit.disabled = false;
          say(t('contact_form_error', 'Das Senden hat nicht geklappt. Schreib uns bitte direkt an ' + MAILTO + '.'), 'error');
        });
    });
  });
})();
