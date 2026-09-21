/* Halle Neun, Demo-Portfolio für KettenKI.
   Das Werkverzeichnis. Alles hier ist erfunden: die Arbeiten, die Jahre,
   die Masse und die Texte. Eine echte Galerie würde genau diese Datei
   pflegen, sonst nichts.
   Schweizer Schreibweise: ss, nie ß. */

const STUDIO = {
  name: 'Halle Neun',
  claim: 'Atelier und Ausstellungsraum',
  place: 'Bern',
  season: 'Werkverzeichnis 2026',
};

const WORKS = [
  {
    id: 'was-wir-tragen',
    title: 'Was wir tragen',
    year: 2024,
    kind: 'Malerei',
    technique: 'Kohle, Öl und Pigment auf Kalkputz',
    size: '150 × 84 cm',
    state: 'Privatsammlung, Zürich',
    image: 'hands-flame-01',
    alt: 'Zwei Hände in Kohle gezeichnet, die eine kleine Flamme schützen, auf rauem dunklem Putz',
    note: [
      'Die Flamme ist der einzige Ort im Bild, an dem Farbe aufgetragen wurde. Alles andere bleibt Kohle auf Putz, bis zur Kante.',
      'Gemalt auf einer Wandplatte, die aus dem Abbruch eines Berner Hinterhauses stammt. Die Risse waren vorher da.',
    ],
  },
  {
    id: 'nordwind',
    title: 'Nordwind',
    year: 2024,
    kind: 'Malerei',
    technique: 'Öl und Tusche auf Leinwand',
    size: '180 × 120 cm',
    state: 'Verfügbar',
    image: 'abstract-expressionist-01',
    alt: 'Grossformatige abstrakte Malerei mit blauen und ockerfarbenen Schwüngen und laufender Farbe',
    note: [
      'Entstanden in vier Sitzungen, jede so lang, wie die Tusche nass blieb. Wo sie getrocknet war, wurde nicht mehr korrigiert.',
      'Die Läufer am unteren Rand sind kein Zufall: Die Leinwand hing während der Arbeit senkrecht an der Hallenwand.',
    ],
  },
  {
    id: 'schwarzer-mond',
    title: 'Schwarzer Mond',
    year: 2024,
    kind: 'Skulptur',
    technique: 'Obsidian, poliert, auf Block aus Carrara-Marmor',
    size: '38 × 42 × 28 cm',
    state: 'Verfügbar',
    image: 'obsidian-sphere-01',
    alt: 'Polierte schwarze Obsidiankugel auf einem rohen weissen Marmorblock',
    note: [
      'Die Kugel ist von Hand nachpoliert, bis sie den Raum spiegelt. Der Sockel wurde bewusst roh gelassen.',
      'Wer nah genug herangeht, sieht sich selbst darin, auf dem Kopf und sehr klein.',
    ],
  },
  {
    id: 'profil-im-gegenlicht',
    title: 'Profil im Gegenlicht',
    year: 2023,
    kind: 'Arbeit auf Papier',
    technique: 'Kohle und Aquarell auf Büttenpapier',
    size: '56 × 42 cm, gerahmt in Eiche',
    state: 'Verfügbar',
    image: 'charcoal-portrait-01',
    alt: 'Porträt im Profil, in Kohle gezeichnet und mit blauem und ockerfarbenem Aquarell laviert',
    note: [
      'Eine Sitzung, zwei Stunden, kein zweiter Versuch. Das Ocker im Haar kam erst am Tag darauf dazu.',
      'Der Blick geht bewusst aus dem Blatt hinaus, damit das Bild nicht zurückschaut.',
    ],
  },
  {
    id: 'schichtgestein',
    title: 'Schichtgestein',
    year: 2025,
    kind: 'Malerei',
    technique: 'Öl, Sand und Wachs auf Leinwand',
    size: '140 × 110 cm',
    state: 'Ausgestellt, Halle Neun',
    image: 'abstract-oil-texture-02',
    alt: 'Stark aufgetragene abstrakte Malerei in Rostrot und Sand, mit dicken Farbschichten wie Gesteinsschichten',
    note: [
      'Sieben Schichten, zwischen denen jeweils zwei Wochen Trocknung lagen. Die obersten wurden mit dem Spachtel wieder aufgerissen.',
      'Im Streiflicht wirft das Bild eigene Schatten. Deshalb hängt es im Raum immer neben einem Fenster.',
    ],
  },
  {
    id: 'frostkoerper',
    title: 'Frostkörper',
    year: 2025,
    kind: 'Skulptur',
    technique: 'Gegossenes Salz und Kristallglas',
    size: '32 × 30 × 14 cm',
    state: 'Verfügbar',
    image: 'crystalline-sculpture-01',
    alt: 'Filigrane weisse Kristallskulptur, die vor warmem unscharfem Licht schwebt',
    note: [
      'Aus einer gesättigten Salzlösung gewachsen und anschliessend in Glas stabilisiert. Zwei Versuche sind vorher zerbrochen.',
      'Die Arbeit verändert sich mit dem Licht im Raum: morgens weiss, am Abend fast bernsteinfarben.',
    ],
  },
  {
    id: 'herbarium-blatt-vii',
    title: 'Herbarium, Blatt VII',
    year: 2022,
    kind: 'Arbeit auf Papier',
    technique: 'Aquarell, Graphit und Collage auf Bütten',
    size: '50 × 65 cm',
    state: 'Privatsammlung, Basel',
    image: 'botanical-watercolor-01',
    alt: 'Getrocknete Doldenblüte über roten und grünen geometrischen Flächen auf hellem Papier',
    note: [
      'Die Pflanze wurde im September am Wegrand gesammelt und drei Monate gepresst, bevor sie aufs Blatt kam.',
      'Die Farbflächen sind nachträglich dazugekommen, als Gegengewicht zu etwas, das sonst nur zart wäre.',
    ],
  },
  {
    id: 'drehmoment',
    title: 'Drehmoment',
    year: 2023,
    kind: 'Skulptur',
    technique: 'Edelstahl, geschliffen und poliert',
    size: '95 × 40 × 40 cm, auf Holzsockel',
    state: 'Verfügbar',
    image: 'kinetic-steel-sculpture-01',
    alt: 'Verdrehte polierte Edelstahlskulptur, die im Tageslicht lange Schatten an die Wand wirft',
    note: [
      'Ein einziges Band aus Stahl, kalt verdreht, bis es von selbst stehen blieb. Geschweisst wurde nur am Fuss.',
      'Der Schatten an der Wand gehört zur Arbeit. Im Ausstellungsraum steht sie deshalb immer vor einer leeren Fläche.',
    ],
  },
  {
    id: 'pulsschlag',
    title: 'Pulsschlag',
    year: 2026,
    kind: 'Installation',
    technique: 'Neonfilament, Stahlseil, Steuerung',
    size: 'Raumgrösse, ca. 6 × 3 m',
    state: 'Ausgestellt, Halle Neun',
    image: 'neon-filament-web-01',
    alt: 'Netz aus leuchtenden Neonfilamenten, das frei in einer dunklen Halle hängt',
    video: 'vid/neon-filament-loop.mp4',
    videoAlt: 'Die Neonfilamente der Installation Pulsschlag glimmen langsam auf und wieder ab',
    note: [
      'Zweiunddreissig Filamente hängen an Stahlseilen und folgen einer Schleife von neun Sekunden. Nichts daran reagiert auf Publikum, und genau das beruhigt.',
      'Die Halle bleibt während der Ausstellung unbeheizt und dunkel. Wer eintritt, braucht etwa eine Minute, bis die Augen die Ränder des Netzes finden.',
    ],
  },
  {
    id: 'doppelknoten',
    title: 'Doppelknoten',
    year: 2024,
    kind: 'Arbeit auf Papier',
    technique: 'Aquarell auf Büttenpapier',
    size: '70 × 50 cm',
    state: 'Verfügbar',
    image: 'abstract-watercolor-01',
    alt: 'Abstraktes Aquarell aus zwei ineinandergreifenden Formen in Tannengrün und Ocker',
    note: [
      'Zwei Formen, die einander halten, in einem Zug nass in nass gemalt. Absetzen hätte die Kante sichtbar gemacht.',
      'Das Ocker ist an drei Stellen absichtlich ins Grün gelaufen. Das war der Moment, an dem das Blatt fertig war.',
    ],
  },
  {
    id: 'rasterbruch',
    title: 'Rasterbruch',
    year: 2022,
    kind: 'Malerei',
    technique: 'Mischtechnik auf Jute',
    size: '160 × 160 cm',
    state: 'Privatsammlung, Bern',
    image: 'mixed-media-abstract-01',
    alt: 'Grosses quadratisches Bild aus grauen und beigen Dreiecken und Rechtecken auf grober Jute',
    note: [
      'Das Raster stammt aus dem Grundriss einer Fabrikhalle, die es nicht mehr gibt. Jedes Feld entspricht einem Raum darin.',
      'Übermalt wurde nur dort, wo die Halle abgebrochen ist. Deshalb die dunklen Stellen in der Mitte.',
    ],
  },
  {
    id: 'anflug',
    title: 'Anflug',
    year: 2021,
    kind: 'Arbeit auf Papier',
    technique: 'Graphit, Aquarell und Zeitungsdruck auf Papier',
    size: '90 × 60 cm',
    state: 'Verfügbar',
    image: 'pencil-bird-flight-01',
    alt: 'Gezeichneter Vogel im Flug vor blauen und rostroten Farbwolken auf collagiertem Zeitungspapier',
    note: [
      'Der Vogel ist nach einer einzigen Beobachtung gezeichnet, der Rest aus dem Gedächtnis ergänzt.',
      'Als Untergrund dienen Zeitungsseiten aus der Woche, in der die Arbeit entstand. Lesbar ist davon fast nichts mehr.',
    ],
  },
  {
    id: 'feldnotiz',
    title: 'Feldnotiz',
    year: 2025,
    kind: 'Arbeit auf Papier',
    technique: 'Mischtechnik und Pflanzendruck auf Bütten',
    size: '75 × 100 cm, gerahmt',
    state: 'Verfügbar',
    image: 'mixed-media-botanical-01',
    alt: 'Collage aus Farbfeldern, Rasterlinien und einem gedruckten Zweig auf hellem Papier',
    note: [
      'Der Zweig wurde direkt aufs Blatt gedruckt, mit Farbe auf der Pflanze statt auf der Platte.',
      'Die Linien darunter sind Notizen aus dem Atelierbuch. Sie blieben stehen, weil sie das Blatt zusammenhalten.',
    ],
  },
  {
    id: 'sternkoerper',
    title: 'Sternkörper',
    year: 2025,
    kind: 'Skulptur',
    technique: 'Kupferdraht, von Hand gelötet',
    size: '60 × 60 × 60 cm, hängend',
    state: 'Verfügbar',
    image: 'wire-star-sculpture-01',
    alt: 'Hängende Skulptur aus dünnem Kupferdraht in Form eines vielzackigen Sterns',
    note: [
      'Rund vierhundert Lötstellen, jede von Hand gesetzt. Die Arbeit wiegt weniger als ein Kilogramm.',
      'Sie hängt an einem einzigen Faden und dreht sich langsam mit der Luft im Raum.',
    ],
  },
  {
    id: 'bruchkante',
    title: 'Bruchkante',
    year: 2026,
    kind: 'Skulptur',
    technique: 'Titan und Gussglas',
    size: '45 × 55 × 30 cm',
    state: 'Ausgestellt, Halle Neun',
    image: 'sculpture-titanium-glass-01',
    alt: 'Skulptur aus scharfkantigem Titan und einer geschwungenen Form aus klarem Gussglas',
    note: [
      'Das Glas wurde in die Titanform gegossen und durfte beim Abkühlen selbst entscheiden, wo es reisst.',
      'Die Kante, die dabei entstand, ist der Grund für den Titel und der einzige Teil, der nicht nachbearbeitet wurde.',
    ],
  },
  {
    id: 'zwei-felder',
    title: 'Zwei Felder',
    year: 2023,
    kind: 'Malerei',
    technique: 'Öl und Spachtelmasse auf Holz',
    size: '100 × 75 cm',
    state: 'Verfügbar',
    image: 'abstract-oil-impasto-01',
    alt: 'Abstraktes Bild mit einem rostroten und einem graublauen Farbfeld in dickem Auftrag',
    note: [
      'Zwei Felder, ein Abstand. Die Fläche dazwischen ist der eigentliche Gegenstand des Bildes.',
      'Die Masse wurde nass mit der Kelle gezogen, sodass die Ränder an den Kanten leicht ausfransen.',
    ],
  },
];

/* Reihenfolge und Grösse der Zellen im Raster. Die Breiten beziehen sich auf
   ein Raster aus zwölf Spalten, "push" versetzt eine Zelle nach unten, damit
   die Reihen nicht wie ein Katalog auf einer Linie stehen.
   Das Video sitzt an neunter Stelle von sechzehn: mitten im Scrollen, weit
   weg von der ersten Zelle und von der letzten Reihe. */
const LAYOUT = [
  { id: 'was-wir-tragen', span: 'full' },
  { id: 'nordwind', span: 'wide' },
  { id: 'schwarzer-mond', span: 'mid', push: true },
  { id: 'profil-im-gegenlicht', span: 'mid' },
  { id: 'schichtgestein', span: 'wide', push: true },
  { id: 'frostkoerper', span: 'third' },
  { id: 'herbarium-blatt-vii', span: 'third', push: true },
  { id: 'drehmoment', span: 'third' },
  { id: 'pulsschlag', span: 'wide', film: true },
  { id: 'doppelknoten', span: 'mid', push: true },
  { id: 'rasterbruch', span: 'full' },
  { id: 'anflug', span: 'mid' },
  { id: 'feldnotiz', span: 'wide', push: true },
  { id: 'sternkoerper', span: 'third' },
  { id: 'bruchkante', span: 'third', push: true },
  { id: 'zwei-felder', span: 'third' },
];

function findWork(id) {
  return WORKS.find((work) => work.id === id) || null;
}

function workNumber(id) {
  const index = WORKS.findIndex((work) => work.id === id);
  return index < 0 ? '' : String(index + 1).padStart(2, '0');
}
