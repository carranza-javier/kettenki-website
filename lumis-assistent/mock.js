// ========================================
// LUMIS KI-Assistent - Mock Configuration
// ========================================

/**
 * Change MOCK_ENABLED to true for simulated responses
 */
const MOCK_CONFIG = {
    enabled: true, // Enable or disable mock mode
    delay: 2000, // Simulated network delay in milliseconds
    randomErrors: false, // Enable random error simulation
    errorRate: 0.1 // 10% chance to simulate a network error
};

/**
 * Mock responses for various questions
 */
const MOCK_RESPONSES = {
    // ========================================
    // CHECKLISTEN - Schichten
    // ========================================
    
    'frühschicht': {
        keywords: ['frühschicht', 'morning shift', 'morgen', 'öffnung', 'opening'],
        answer: `Während der Frühschicht bei LUMIS KAFFEEBAR musst du folgende Aufgaben erledigen:

Frühschicht - Öffnung (7:00 Uhr):
1. Licht einschalten und Heizung/Klimaanlage prüfen
2. Kaffeemaschinen einschalten und vorheizen (15 Minuten)
3. Kasse vorbereiten und Startbestand zählen
4. Vitrine mit frischen Backwaren auffüllen
5. Außenbereich herrichten (Tische, Stühle, Sonnenschirme)
6. Milch und Zutaten aus dem Kühlschrank holen

Frühschicht - Mise en place:
1. Kaffeebohnen auffüllen
2. Syrups und Toppings bereitstellen
3. To-Go Becher und Deckel nachfüllen
4. Geschirr polieren und bereitstellen
5. Menütafeln aktualisieren

Frühschicht - Während der Schicht:
1. Kontinuierlich Tische abräumen und reinigen
2. Vitrine nachfüllen bei Bedarf
3. Kaffeemaschinen sauber halten
4. Müll regelmäßig leeren
5. Kundenbestellungen freundlich aufnehmen`
    },
    
    'spätschicht': {
        keywords: ['spätschicht', 'evening shift', 'abend', 'schließung', 'closing', 'ende'],
        answer: `Während der Spätschicht bei LUMIS KAFFEEBAR musst du folgende Aufgaben erledigen:

Spätschicht - Mise en place:
1. Reservationen für den Abend checken
2. Eis auffüllen, Reserve in Kühlelement hinten
3. Apérogeschirr bereitstellen (Schäleli, Zahnstocher & kleine Teller)
4. Zitrusfrüchte vorschneiden (sicher 2x Zitrone, 1x Orange)
5. Check ob Bierkühlschrank im Keller aufgefüllt ist

Spätschicht - Während der Schicht:
1. Tische in der Lounge um 17:00 Uhr putzen, wenn nötig
2. Coworking-Sachen aus der Lounge verräumen
3. Kinderecke aufräumen, wenn möglich
4. Abendbeleuchtung einschalten (Spot 1 und 3 raus, LED-Strahler raus)
5. Backofen runterkühlen lassen und um 19:00 Uhr putzen

Spätschicht - Schließung (22:00 Uhr):
1. Kasse abrechnen und Tagesabschluss durchführen
2. Kaffeemaschinen gründlich reinigen und ausschalten
3. Vitrine ausräumen und reinigen
4. Böden wischen (Nassreinigung)
5. Müll rausbringen
6. Licht ausschalten und Alarm aktivieren
7. Alle Türen abschließen`
    },
    
    'mittagsschicht': {
        keywords: ['mittagsschicht', 'mittag', 'lunch shift', 'afternoon'],
        answer: `Während der Mittagsschicht bei LUMIS KAFFEEBAR musst du folgende Aufgaben erledigen:

Mittagsschicht - Übergabe (12:00 Uhr):
1. Briefing von der Frühschicht entgegennehmen
2. Kassenstand gemeinsam prüfen
3. Vitrine und Lagerstand checken
4. Besondere Vorkommnisse notieren

Mittagsschicht - Mise en place:
1. Lunch-Menü vorbereiten
2. Salatbar auffüllen und auffrischen
3. Sandwich-Zutaten bereitstellen
4. Suppe des Tages vorbereiten
5. Besteck und Servietten nachfüllen

Mittagsschicht - Während der Schicht:
1. Lunch-Rush managen (12:00-14:00)
2. To-Go Bestellungen schnell bearbeiten
3. Tische zwischen Gästen schnell reinigen
4. Vitrine kontinuierlich auffüllen
5. Um 16:00 Uhr Übergabe an Spätschicht vorbereiten`
    },
    
    // ========================================
    // REZEPTE - Kaffeegetränke
    // ========================================
    
    'cappuccino': {
        keywords: ['cappuccino', 'cappucino'],
        answer: `So bereitest du einen perfekten Cappuccino zu:

Zutaten:
- 1 Espresso (25-30ml)
- 150ml frische Vollmilch (3,5% Fett)
- Optional: Kakaopulver zum Bestäuben

Zubereitung:
1. Espresso in eine vorgewärmte Cappuccino-Tasse (180ml) extrahieren
2. Frische, kalte Milch in den Milchpitcher füllen
3. Milch aufschäumen bis sie 60-65°C erreicht (nicht heißer!)
4. Der Schaum sollte mikrofein und cremig sein (wie Seidenpapier)
5. Pitcher leicht schwenken um große Blasen zu entfernen
6. Milch in kreisenden Bewegungen zum Espresso gießen
7. Mit einem Löffel den festeren Schaum obendrauf geben
8. Optional mit Kakaopulver bestäuben

Verhältnis: 1/3 Espresso, 1/3 heiße Milch, 1/3 Milchschaum

Tipp: Die Milch sollte süßlich schmecken - das bedeutet, sie wurde richtig aufgeschäumt!`
    },
    
    'latte': {
        keywords: ['latte', 'latte macchiato', 'macchiato'],
        answer: `So bereitest du einen Latte Macchiato zu:

Zutaten:
- 1 Espresso (25-30ml)
- 200ml frische Vollmilch
- Optional: Sirup nach Wahl

Zubereitung:
1. Optional: Sirup in ein hohes Latte-Glas geben
2. Milch auf 60-65°C aufschäumen (mehr Milch, weniger Schaum als Cappuccino)
3. Aufgeschäumte Milch ins Glas gießen
4. 30 Sekunden warten, damit sich Milch und Schaum trennen
5. Espresso langsam und vorsichtig durch den Schaum gießen
6. Der Espresso sollte sich zwischen Milch und Schaum absetzen
7. Es entstehen drei sichtbare Schichten

Die drei Schichten:
- Unten: Heiße Milch
- Mitte: Espresso (die "Macchia" = Fleck)
- Oben: Milchschaum

Tipp: Für die perfekte Schichtung den Espresso über einen Löffel laufen lassen!`
    },
    
    'espresso': {
        keywords: ['espresso', 'ristretto', 'lungo'],
        answer: `So bereitest du einen perfekten Espresso zu:

Espresso-Grundlagen:
- Menge: 25-30ml (einfacher Espresso)
- Brühzeit: 25-30 Sekunden
- Temperatur: 90-96°C
- Druck: 9 bar

Zubereitung:
1. Siebträger vorwärmen (heißes Wasser durchlaufen lassen)
2. Siebträger abtrocknen
3. 7-9g frisch gemahlenen Kaffee ins Sieb dosieren (für Single Shot)
4. Kaffee gleichmäßig im Sieb verteilen
5. Mit dem Tamper fest und gerade andrücken (ca. 15kg Druck)
6. Siebträger einsetzen und sofort Brühvorgang starten
7. Extraktion sollte nach 25-30 Sekunden ca. 25-30ml ergeben
8. Die Crema sollte haselnussbraun und stabil sein

Qualitätsmerkmale:
- Haselnussbraune Crema (2-3mm dick)
- Sirupartige Konsistenz
- Ausgewogener Geschmack (nicht zu bitter, nicht zu sauer)

Varianten:
- Ristretto: 15-20ml in 20-25 Sekunden (intensiver)
- Lungo: 40-50ml in 35-40 Sekunden (milder)`
    },
    
    'flat_white': {
        keywords: ['flat white', 'flatwhite'],
        answer: `So bereitest du einen Flat White zu:

Zutaten:
- 2 Espresso (Doppio, 50-60ml)
- 120ml frische Vollmilch

Zubereitung:
1. Zwei Espresso (Doppio) in eine vorgewärmte Cappuccino-Tasse extrahieren
2. 120ml Milch aufschäumen auf 60-65°C
3. WICHTIG: Weniger Schaum als beim Cappuccino - die Milch sollte glänzend und seidig sein
4. Milchtextur sollte sehr mikrofein sein ("microfoam")
5. Milch in die Tasse gießen und dabei Latte Art erstellen
6. Der Schaum sollte nur 0.5-1cm dick sein

Unterschied zum Cappuccino:
- Stärkerer Kaffeegeschmack (Doppio statt Single)
- Weniger Schaum, mehr flüssige Milch
- Kleinere Tasse
- Seidigere Textur

Tipp: Der Flat White kommt aus Australien/Neuseeland und ist perfekt für Kaffeeliebhaber, die einen starken, aber cremigen Kaffee mögen!`
    },
    
    // ========================================
    // ALLGEMEINE FRAGEN
    // ========================================
    
    'öffnungszeiten': {
        keywords: ['öffnungszeiten', 'opening hours', 'wann öffnen', 'wann schließen', 'geöffnet'],
        answer: `Die Öffnungszeiten der LUMIS KAFFEEBAR:

Montag - Freitag:
7:00 - 22:00 Uhr

Samstag:
8:00 - 22:00 Uhr

Sonntag:
9:00 - 20:00 Uhr

Feiertage:
Bitte prüfe den aktuellen Aushang oder frage den Manager.

Letzte Bestellung:
30 Minuten vor Schließung

Küche:
Warme Speisen bis 21:30 Uhr (Mo-Sa)
Warme Speisen bis 19:30 Uhr (So)`
    },
    
    'default': {
        keywords: ['default'],
        answer: `Vielen Dank für deine Frage! 

Ich bin der LUMIS KI-Assistent und kann dir helfen bei:

**Checklisten & Aufgaben:**
- Frühschicht, Mittagsschicht, Spätschicht
- Öffnung und Schließung
- Tägliche Routinen

**Kaffee-Rezepte:**
- Cappuccino, Latte Macchiato, Flat White
- Espresso, Americano
- Cold Brew, Iced Coffee

**Allgemeine Infos:**
- Öffnungszeiten
- Arbeitsabläufe
- Spezielle Anfragen

Was möchtest du genau wissen?`
    }
};

/**
 * Searches for a mock response based on the question
 * @param {string} question - User question
 * @returns {string} - Mock answer
 */
function findMockResponse(question) {
    const questionLower = question.toLowerCase();
    
    // Buscar por keywords
    for (const [category, data] of Object.entries(MOCK_RESPONSES)) {
        if (category === 'default') continue;
        
        const matchFound = data.keywords.some(keyword => 
            questionLower.includes(keyword.toLowerCase())
        );
        
        if (matchFound) {
            return data.answer;
        }
    }
    
    // If no match, return default answer
    return MOCK_RESPONSES.default.answer;
}

/**
 * Simulates asking LUMIS with a mock response
 * @param {string} question - User question
 * @returns {Promise<Object>} - Mock API response
 */
async function mockAskLUMIS(question) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, MOCK_CONFIG.delay));
    
    // Simulate random errors
    if (MOCK_CONFIG.randomErrors && Math.random() < MOCK_CONFIG.errorRate) {
        throw new Error('NETWORK');
    }
    
    // Search for mock response
    const answer = findMockResponse(question);
    
    // Return mock response object
    return {
        question: question,
        answer: answer,
        timestamp: new Date().toISOString(),
        mock: true // Indicate this is a mock response
    };
}

// Export for use in other modules (script.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MOCK_CONFIG, mockAskLUMIS };
}
