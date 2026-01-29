const translations = {
  de: {
    // Navigation
    nav_home: 'Start',
    nav_about: 'Über mich',
    nav_services: 'Lösungen',
    nav_contact: 'Kontakt',
    
    // Hero Section
    hero_title: 'KettenKI',
    hero_slogan: 'Warum weniger tun, wenn man mehr tun kann',
    hero_subtitle: 'KI-Lösungen in Cloud-Architekturen für Schweizer Unternehmen',
    
    // About Page
    about_title: 'Über mich',
    about_text: 'Javier Carranza ist ein Softwareingenieur, der bewusst abseits des Lärms und der Hektik arbeitet, die die heutige Tech-Welt dominieren. Er glaubt an Einfachheit, Qualität und langfristiges Denken, auch wenn der Kontext schnelle und oberflächliche Lösungen fordert.',
    about_text2: 'In einer zunehmend mit sofortigen Antworten und unbegründeten Entscheidungen gesättigten Branche sucht Javier weiter zu gehen: Probleme tiefgreifend zu verstehen und sie mit ethischen, verantwortungsvollen und nachhaltigen Lösungen anzugehen.',
    about_text3: 'Seine Arbeit konzentriert sich auf den Aufbau sicherer, interpretierbarer und effizienter Systeme, in denen Technologie kein Selbstzweck ist, sondern ein Werkzeug im Dienste der Menschen, des Geschäfts und der Zukunft.',
    
    // Services Page
    services_title: 'Anwendungsfälle',
    services_subtitle: 'Bewährte KI-Lösungen für reale Geschäftsprobleme',
    
    // Case 1 - KettenKI
    case1_title: 'KettenKI',
    case1_category: 'Logistik & Lieferkette',
    case1_description: 'KI-Assistent für Logistik- und Lieferkettenunternehmen',
    case1_benefit1: 'Echte KI-Werte im Geschäft',
    case1_benefit1_desc: 'Wandelt Text in strukturiertes JSON um und interpretiert, klassifiziert, priorisiert und empfiehlt Maßnahmen bei mehrdeutigen und dringenden Problemen',
    case1_benefit2: 'Vollständige Cloud-Pipeline',
    case1_benefit2_desc: 'Serverlose Architektur mit Lambda, Bedrock Runtime, S3, Athena und QuickSight auf AWS',
    case1_benefit3: 'Skalierbarkeit & Robustheit',
    case1_benefit3_desc: 'Verarbeitet unstrukturierte Eingaben aus mehreren Quellen und erzeugt konsistente, analysierbare Ergebnisse',
    case1_example_label: 'Beispiel',
    case1_example_input: 'Input: "Lieferung XY verspätet..."',
    case1_example_process: 'AWS Bedrock Analyse',
    case1_example_output: 'Output: Strukturiertes JSON',
    
    // Case 2 - RAG Café
    case2_title: 'Mehrsprachiges RAG-System',
    case2_category: 'Wissensmanagement',
    case2_description: 'KI-Assistent für betriebliches Wissensmanagement',
    //case2_context: 'Implementiert für ein Café in Bern mit mehrsprachigem Team',
    case2_solution: 'RAG-System mit AWS Bedrock, das sofortigen Zugriff auf Betriebshandbücher, Rezepte und Verfahren in natürlicher Sprache bietet',
    case2_benefit1: 'Mehrsprachige Unterstützung',
    case2_benefit1_desc: 'Mitarbeiter können in ihrer bevorzugten Sprache Fragen stellen',
    case2_benefit2: 'Sofortiger Wissenszugriff',
    case2_benefit2_desc: 'Eliminiert die Notwendigkeit, physische Handbücher zu durchsuchen',
    case2_benefit3: 'Verbesserte Betriebseffizienz',
    case2_benefit3_desc: 'Reduziert Schulungszeit und erhöht die Service-Konsistenz',
    case2_example_label: 'Beispiel-Dialog',
    case2_example_question: 'Wie macht man einen Cappuccino?',
    case2_example_answer: 'Ein Cappuccino besteht aus: 1 Espresso (25ml), 100ml aufgeschäumte Milch (2/3 Schaum, 1/3 Milch). Temperatur: 65-70°C...',
    
    // Contact Page
    contact_title: 'Kontakt',
    contact_email: 'E-Mail',
    contact_linkedin: 'LinkedIn',
    contact_cta: 'Lassen Sie uns über Ihre KI-Lösung sprechen',
    
    // Footer
    footer_text: '© 2026 KettenKI. Entwickelt mit Präzision.',
  },
  
  en: {
    // Navigation
    nav_home: 'Home',
    nav_about: 'About',
    nav_services: 'Solutions',
    nav_contact: 'Contact',
    
    // Hero Section
    hero_title: 'KettenKI',
    hero_slogan: 'Why do less when more is possible',
    hero_subtitle: 'AI Solutions in Cloud Architectures for Swiss Companies',
    
    // About Page
    about_title: 'About Me',
    about_text: 'Javier Carranza is a software engineer who deliberately works away from the noise and rush that dominate today’s technology world. With over 14 years of experience in international projects, he has traveled through countless lines of code aboard different spaceships, each with its own crew and rules—but always moving in the same direction.',
    about_text2: 'He believes in simplicity, quality, and long-term thinking, even when the context pushes for quick and superficial solutions.',
    about_text3: 'Recently, he has enhanced his skills with “supernatural powers” in cloud architecture, and more recently, by exploring the new world of artificial intelligence. This is not science fiction: it is reality.',
    about_text4: 'With his futuristic glasses, he has seen a new technological era emerge and does not want to stand on the sidelines of this journey at the speed of light.',
    about_text5: 'He lives on planet Bern, Switzerland, and is open to new challenges to help you optimize your work.',
    about_text6: 'KettenKI was born with the idea of creating a robust and modern chain between people and artificial intelligence, guided by ethical and responsible values.',
    about_text7: 'We care about the security and regulatory compliance of these technologies, as they may have vulnerabilities that could be exploited if not properly managed.',
    about_text8: 'KettenKI exists in a galaxy not so far away, growing day by day and adding new solid links of knowledge. These intelligent links will support people in performing their tasks more comfortably and dynamically.',
    about_text9: 'It is not about replacing people, but about providing effective and reliable support.',
    // Services Page
    services_title: 'Use Cases',
    services_subtitle: 'Proven AI solutions for real business problems',
    
    // Case 1 - KettenKI
    case1_title: 'KettenKI',
    case1_category: 'Logistics & Supply Chain',
    case1_description: 'AI assistant for logistics and supply chain management companies',
    case1_benefit1: 'Real AI Value in Business',
    case1_benefit1_desc: 'Transforms text into structured JSON while interpreting, classifying, prioritizing, and recommending actions for ambiguous and urgent problems',
    case1_benefit2: 'Complete Cloud Pipeline',
    case1_benefit2_desc: 'Serverless architecture using Lambda, Bedrock Runtime, S3, Athena, and QuickSight on AWS',
    case1_benefit3: 'Scalability & Robustness',
    case1_benefit3_desc: 'Handles messy inputs from multiple sources and produces consistent, parseable outputs',
    case1_example_label: 'Example',
    case1_example_input: 'Input: "Delivery XY delayed..."',
    case1_example_process: 'AWS Bedrock Analysis',
    case1_example_output: 'Output: Structured JSON',
    
    // Case 2 - RAG Café
    case2_title: 'Multilingual RAG System',
    case2_category: 'Knowledge Management',
    case2_description: 'AI assistant for enterprise knowledge management',
    //case2_context: 'Implemented for a café in Bern with multilingual team',
    case2_solution: 'RAG system with AWS Bedrock providing instant access to operational manuals, recipes, and procedures in natural language',
    case2_benefit1: 'Multilingual Support',
    case2_benefit1_desc: 'Staff can ask questions in their preferred language',
    case2_benefit2: 'Instant Knowledge Access',
    case2_benefit2_desc: 'Eliminates the need to search through physical manuals',
    case2_benefit3: 'Improved Operational Efficiency',
    case2_benefit3_desc: 'Reduces training time and increases service consistency',
    case2_example_label: 'Example Dialog',
    case2_example_question: 'How do you make a cappuccino?',
    case2_example_answer: 'A cappuccino consists of: 1 espresso (25ml), 100ml frothed milk (2/3 foam, 1/3 milk). Temperature: 65-70°C...',
    
    // Contact Page
    contact_title: 'Contact',
    contact_email: 'Email',
    contact_linkedin: 'LinkedIn',
    contact_cta: 'Let\'s discuss your AI solution',
    
    // Footer
    footer_text: '© 2026 KettenKI. Built with precision.',
  }
};

let currentLang = 'de';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('preferredLanguage', lang);
  updateContent();
  
  // Update active state on language selector
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

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferredLanguage') || 'de';
  setLanguage(savedLang);
});
