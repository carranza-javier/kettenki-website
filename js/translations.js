const translations = {
  de: {
    nav_home: 'Start',
    nav_about: 'Über mich',
    nav_services: 'Lösungen',
    nav_contact: 'Kontakt',
    
    hero_title: 'KettenKI',
    hero_slogan: 'Warum weniger tun, wenn man mehr tun kann',
    hero_subtitle: 'Experimentelle KI-Lösungen - Kostenlos testen, bei Erfolg skalieren',
    
    about_title: 'Über mich',
    about_text: 'Javier Carranza ist ein Softwareingenieur, der bewusst abseits des Lärms und der Eile arbeitet, die die heutige Technologiewelt dominieren. Mit mehr als 14 Jahren Erfahrung in internationalen Projekten verfügt er über umfassende Kenntnisse in unterschiedlichsten technischen Umgebungen.',
    about_text2: 'Er glaubt an Einfachheit, Qualität und langfristiges Denken, auch wenn der Kontext oft zu schnellen und oberflächlichen Lösungen drängt.',
    about_text3: 'Kürzlich hat er seine Fähigkeiten in der Cloud-Architektur weiter ausgebaut und sich zuletzt intensiv mit dem Bereich der Künstlichen Intelligenz beschäftigt.',
    about_text4: 'Er hat die Entstehung einer neuen technologischen Ära miterlebt und gestaltet diesen Transformationsprozess aktiv mit.',
    about_text5: 'Er lebt in Bern, Schweiz, und ist offen für neue Herausforderungen, um andere bei der Optimierung ihrer Arbeit zu unterstützen.',
    about_title2: 'Über KettenKI',
    about_text6: 'KettenKI entstand mit der Idee, eine robuste und moderne Verbindung zwischen Menschen und Künstlicher Intelligenz zu schaffen, geleitet von ethischen und verantwortungsvollen Werten.',
    about_text7: 'Wir legen großen Wert auf Sicherheit und die Einhaltung gesetzlicher Vorschriften, da diese Technologien Schwachstellen aufweisen können, wenn sie nicht korrekt verwaltet werden.',
    about_text8: 'KettenKI entwickelt sich kontinuierlich weiter, wächst von Tag zu Tag und erweitert ihr solides Wissensfundament. Dieses Wissen unterstützt Menschen dabei, ihre Aufgaben effizienter und flexibler zu erledigen.',
    about_text9: 'Es geht nicht darum, Menschen zu ersetzen, sondern ihnen eine effektive und verlässige Unterstützung zu bieten.',

    services_title: 'Unsere Prototypen',
    services_subtitle: 'Experimentelle KI-Lösungen zum Testen',
    services_disclaimer_title: '🧪 Wichtiger Hinweis',
    services_disclaimer_text: 'Diese Lösungen sind experimentelle Prototypen. Sie sind kostenlos zum Testen, funktional und getestet, aber ohne Garantie oder SLA. Bei Erfolg: Gemeinsame Weiterentwicklung möglich.',
    
    bambera_title: 'BAMBERA',
    bambera_tagline: 'Digitale Assistentin für Ihr Team',
    bambera_description: 'BAMBERA digitalisiert Betriebshandbücher und Verfahren und wandelt sie in intelligente Unterstützung um. Mitarbeiter erhalten sofortigen Zugriff auf Informationen durch Fragen in natürlicher Sprache. Verfügbar in mehreren Sprachen.',
    bambera_for_whom: 'Gastronomie, Industrie- und Handelsbereiche mit komplexen Betriebshandbüchern, Kinderbetreuung.',
    bambera_benefit1: 'Sofortiger Zugriff auf operatives Wissen',
    bambera_benefit2: 'Effiziente Kundenberatung',
    bambera_benefit3: 'Reduzierung der Schulungszeit für Mitarbeiter',
    bambera_benefit4: 'Mobiloptimierte Benutzeroberfläche',
    bambera_benefit5: 'Funktioniert in mehreren Sprachen (Deutsch, Französisch, Italienisch, Englisch, Spanisch)',
    bambera_case1_title: 'Gastronomie',
    bambera_case1_question: 'Welche Gerichte enthalten Haselnüsse?',
    bambera_case1_answer: 'Gerichte MIT Haselnüssen:\n• Schokoladenkuchen (Haselnuss-Ganache)\n• Herbstsalat (karamellisierte Haselnüsse)\n• Müesli (enthält Haselnüsse)',
    bambera_case2_title: 'Industrie',
    bambera_case2_question: 'Maschine zeigt Fehler E347, was tun?',
    bambera_case2_answer: 'Fehler E347: Temperatursensor defekt.\n\n1. Maschine ausschalten\n2. 10 Minuten warten\n3. Servicetechniker unter +41 31 XXX kontaktieren',
    
    liviana_title: 'LIVIANA',
    liviana_tagline: 'Intelligente Chatbot für Ihre Website',
    liviana_description: 'LIVIANA beantwortet Kundenanfragen auf Ihrer Website automatisch. Reduziert E-Mails und Telefonanrufe. Verfügbar 24 Stunden.',
    liviana_for_whom: 'Fitnessstudios, medizinische Kliniken, professionelle Dienstleistungen, Wellness.',
    liviana_benefit1: 'Automatisierter 24/7-Kundenservice',
    liviana_benefit2: 'Reduzierung wiederholter Anfragen',
    liviana_benefit3: 'Integration in bestehende Website',
    liviana_case_title: 'Beispielanfrage',
    liviana_case_q1: 'Kann ich eine Klasse vor der Anmeldung ausprobieren?',
    liviana_case_q2: 'Gibt es Einführungskurse für Anfänger?',
    liviana_case_q3: 'Ist Vorerfahrung oder spezifische Fitness erforderlich?',
    liviana_case_answer: 'Ja, wir bieten eine kostenlose Probestunde an. Einführungskurse finden montags und mittwochs um 18:00 statt. Keine Vorerfahrung nötig - alle Fitnesslevel willkommen!',
    
    fandango_title: 'FANDANGO',
    fandango_tagline: 'Intelligente Kommunikationsautomatisierung',
    fandango_description: 'FANDANGO wandelt unstrukturierte Kommunikation automatisch in organisierte Daten um. Interpretiert Nachrichten, E-Mails oder Sprachnotizen und generiert klassifizierte, verarbeitungsbereite Informationen.',
    fandango_for_whom: 'Medizinische Kliniken, Logistikunternehmen, Organisationen, die unstrukturierte Kommunikation verarbeiten.',
    fandango_benefit1: 'Automatische Umwandlung von Text in strukturierte Daten',
    fandango_benefit2: 'Klassifizierung nach Dringlichkeit, Kategorie und Risiko',
    fandango_benefit3: 'Integration mit bestehenden Verwaltungssystemen (ERP, CRM, EMR)',
    fandango_benefit4: 'Reduzierung manueller Dateneingabe',
    fandango_case1_title: 'Logistik',
    fandango_case1_input: 'Sendung XY verspätet, dringender Kunde, mögliche Strafe...',
    fandango_case1_output: 'FANDANGO generiert:',
    fandango_case2_title: 'Medizin',
    fandango_case2_input: 'Patient 45 Jahre, Schmerzen linke Brust, Hypertonie in der Vorgeschichte...',
    fandango_case2_output: 'FANDANGO strukturiert Informationen für elektronische Patientenakte.',
    
    cta_learn_more: 'Mehr erfahren',
    cta_contact: 'Gratis testen',
    cta_prototype_badge: '🧪 Prototyp',
    
    label_benefits: 'Hauptvorteile',
    label_for_whom: 'Für wen',
    label_use_cases: 'Anwendungsbeispiele',
    label_question: 'Frage',
    label_answer: 'Antwort',
    
    contact_title: 'Kontakt',
    contact_email: 'E-Mail',
    contact_linkedin: 'LinkedIn',
    contact_cta: 'Lassen Sie uns über Ihre KI-Lösung sprechen',
    
    footer_text: '© 2026 KettenKI. Entwickelt mit Präzision.',
  },
  
  en: {
    nav_home: 'Home',
    nav_about: 'About',
    nav_services: 'Solutions',
    nav_contact: 'Contact',
    
    hero_title: 'KettenKI',
    hero_slogan: 'Why do less when more is possible',
    hero_subtitle: 'Experimental AI Solutions - Free testing, scale on success',
    
    about_title: 'About Me',
    about_text: 'Javier Carranza is a software engineer who deliberately works away from the noise and rush that dominate today\'s technology world. With over 14 years of experience in international projects, he has extensive knowledge in a wide range of technical environments.',
    about_text2: 'He believes in simplicity, quality, and long-term thinking, even when the context often pushes for quick and superficial solutions.',
    about_text3: 'Recently, he has further developed his skills in cloud architecture and has focused intensively on the field of artificial intelligence.',
    about_text4: 'He has witnessed the emergence of a new technological era and actively contributes to shaping this transformation process.',
    about_text5: 'He lives in Bern, Switzerland, and is open to new challenges, helping others optimize their work.',
    about_title2: 'About KettenKI',
    about_text6: 'KettenKI was created with the idea of building a robust and modern connection between humans and artificial intelligence, guided by ethical and responsible values.',
    about_text7: 'We place great emphasis on security and compliance with regulations, as these technologies can have vulnerabilities if not properly managed.',
    about_text8: 'KettenKI continuously evolves, growing day by day and expanding its solid knowledge base. This knowledge helps people perform their tasks more efficiently and flexibly.',
    about_text9: 'The goal is not to replace people, but to provide them with effective and reliable support.',
    
    services_title: 'Our Prototypes',
    services_subtitle: 'Experimental AI solutions for testing',
    services_disclaimer_title: '🧪 Important Notice',
    services_disclaimer_text: 'These solutions are experimental prototypes. They are free to test, functional and tested, but without guarantee or SLA. On success: Joint development possible.',
    
    bambera_title: 'BAMBERA',
    bambera_tagline: 'Digital assistant for your team',
    bambera_description: 'BAMBERA digitizes operational manuals and procedures, converting them into intelligent assistance. Staff access information instantly through natural language questions. Available in multiple languages.',
    bambera_for_whom: 'Hospitality, industrial or commercial sectors with complex operational manuals, childcare.',
    bambera_benefit1: 'Instant access to operational knowledge',
    bambera_benefit2: 'Efficient customer consultation',
    bambera_benefit3: 'Reduced employee training time',
    bambera_benefit4: 'Mobile-optimized user interface',
    bambera_benefit5: 'Works in multiple languages (German, French, Italian, English, Spanish)',
    bambera_case1_title: 'Hospitality',
    bambera_case1_question: 'Which dishes contain hazelnuts?',
    bambera_case1_answer: 'Dishes WITH hazelnuts:\n• Chocolate cake (hazelnut ganache)\n• Autumn salad (caramelized hazelnuts)\n• Muesli (contains hazelnuts)',
    bambera_case2_title: 'Industry',
    bambera_case2_question: 'Machine shows error E347, what to do?',
    bambera_case2_answer: 'Error E347: Temperature sensor fault.\n\n1. Turn off machine\n2. Wait 10 minutes\n3. Contact service technician at +41 31 XXX',
    
    liviana_title: 'LIVIANA',
    liviana_tagline: 'Intelligent chatbot for your website',
    liviana_description: 'LIVIANA automatically responds to customer inquiries on your website. Reduces emails and phone calls. Available 24 hours.',
    liviana_for_whom: 'Fitness studios, medical clinics, professional services, wellness.',
    liviana_benefit1: 'Automated 24/7 customer service',
    liviana_benefit2: 'Reduction of repetitive inquiries',
    liviana_benefit3: 'Integration into existing website',
    liviana_case_title: 'Example inquiry',
    liviana_case_q1: 'Can I try a class before signing up?',
    liviana_case_q2: 'Are there introductory classes for beginners?',
    liviana_case_q3: 'Is previous experience or specific fitness level required?',
    liviana_case_answer: 'Yes, we offer a free trial session. Introductory classes are on Mondays and Wednesdays at 6:00 PM. No experience needed - all fitness levels welcome!',
    
    fandango_title: 'FANDANGO',
    fandango_tagline: 'Intelligent communication automation',
    fandango_description: 'FANDANGO automatically converts unstructured communications into organized data. Interprets messages, emails or voice notes and generates classified information ready for processing.',
    fandango_for_whom: 'Medical clinics, logistics companies, organizations processing unstructured communications.',
    fandango_benefit1: 'Automatic conversion of text to structured data',
    fandango_benefit2: 'Classification by urgency, category and risk',
    fandango_benefit3: 'Integration with existing management systems (ERP, CRM, EMR)',
    fandango_benefit4: 'Reduction of manual data entry',
    fandango_case1_title: 'Logistics',
    fandango_case1_input: 'Shipment XY delayed, urgent client, possible penalty...',
    fandango_case1_output: 'FANDANGO generates:',
    fandango_case2_title: 'Medicine',
    fandango_case2_input: 'Patient 45 years old, left chest pain, hypertension history...',
    fandango_case2_output: 'FANDANGO structures information for electronic medical record.',
    
    cta_learn_more: 'Learn more',
    cta_contact: 'Free trial',
    cta_prototype_badge: '🧪 Prototype',
    
    label_benefits: 'Key Benefits',
    label_for_whom: 'For Whom',
    label_use_cases: 'Use Cases',
    label_question: 'Question',
    label_answer: 'Answer',
    
    contact_title: 'Contact',
    contact_email: 'Email',
    contact_linkedin: 'LinkedIn',
    contact_cta: 'Let\'s discuss your AI solution',
    
    footer_text: '© 2026 KettenKI. Built with precision.',
  }
};

let currentLang = 'de';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('preferredLanguage', lang);
  updateContent();
  
  document.querySelectorAll('.lang-option').forEach(option => {
    option.classList.toggle('active', option.dataset.lang === lang);
  });
}

function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      element.textContent = translations[currentLang][key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferredLanguage') || 'de';
  setLanguage(savedLang);
});
