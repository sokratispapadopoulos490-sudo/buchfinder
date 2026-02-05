// Buchdatenbank mit Tags und Metadaten
export const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9783442178582",
    tags: ["persoenliche_entwicklung", "fokus_produktivitaet", "praktisch"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["praktisch", "wissenschaftlich"],
    description: "Wie kleine Gewohnheiten große Veränderungen bewirken.",
    coverColor: "bg-amber-100",
    ageGroup: "erwachsene"
  },
  {
    id: 2,
    title: "Die Kunst des klaren Denkens",
    author: "Rolf Dobelli",
    isbn: "9783423348263",
    tags: ["lernen_wissen", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["praktisch", "kurz"],
    description: "52 Denkfehler, die man besser anderen überlässt.",
    coverColor: "bg-slate-100",
    ageGroup: "erwachsene"
  },
  {
    id: 3,
    title: "Der Weg des Künstlers",
    author: "Julia Cameron",
    isbn: "9783426875049",
    tags: ["kreativitaet", "persoenliche_entwicklung", "sinn_philosophie"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["praktisch", "reflektierend"],
    description: "Ein 12-Wochen-Programm zur Entfaltung der kreativen Kräfte.",
    coverColor: "bg-violet-100",
    ageGroup: "erwachsene"
  },
  {
    id: 4,
    title: "Stille",
    author: "Erling Kagge",
    isbn: "9783458363910",
    tags: ["stress_ruhe", "sinn_philosophie"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["reflektierend", "kurz"],
    description: "Ein Entdecker über die Stille in einer lauten Welt.",
    coverColor: "bg-sky-100",
    ageGroup: "erwachsene"
  },
  {
    id: 5,
    title: "Deep Work",
    author: "Cal Newport",
    isbn: "9783868816570",
    tags: ["fokus_produktivitaet", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["wissenschaftlich", "praktisch"],
    description: "Regeln für konzentriertes Arbeiten in einer zerstreuten Welt.",
    coverColor: "bg-indigo-100",
    ageGroup: "erwachsene"
  },
  {
    id: 6,
    title: "Gewaltfreie Kommunikation",
    author: "Marshall B. Rosenberg",
    isbn: "9783955713003",
    tags: ["beziehung_kommunikation", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "lang",
    style: ["praktisch", "wissenschaftlich"],
    description: "Eine Sprache des Lebens für tiefere Verbindungen.",
    coverColor: "bg-rose-100",
    ageGroup: "erwachsene"
  },
  {
    id: 7,
    title: "Der Mönch, der seinen Ferrari verkaufte",
    author: "Robin Sharma",
    isbn: "9783426874837",
    tags: ["sinn_philosophie", "persoenliche_entwicklung", "stress_ruhe"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "reflektierend"],
    description: "Eine Parabel über die Erfüllung von Träumen.",
    coverColor: "bg-orange-100",
    ageGroup: "erwachsene"
  },
  {
    id: 8,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "9780141033570",
    tags: ["lernen_wissen", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["wissenschaftlich", "anspruchsvoll"],
    description: "Wie wir denken: schnell, intuitiv, langsam, rational.",
    coverColor: "bg-emerald-100",
    ageGroup: "erwachsene"
  },
  {
    id: 9,
    title: "Ikigai",
    author: "Héctor García & Francesc Miralles",
    isbn: "9783548060903",
    tags: ["sinn_philosophie", "koerper_gesundheit", "stress_ruhe"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["reflektierend", "kurz"],
    description: "Das japanische Geheimnis für ein langes, glückliches Leben.",
    coverColor: "bg-pink-100",
    ageGroup: "erwachsene"
  },
  {
    id: 10,
    title: "Essentialism",
    author: "Greg McKeown",
    isbn: "9780804137386",
    tags: ["fokus_produktivitaet", "stress_ruhe", "finanzen_organisation"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["praktisch", "kurz"],
    description: "Weniger, aber besser: Die disziplinierte Verfolgung des Wesentlichen.",
    coverColor: "bg-teal-100",
    ageGroup: "erwachsene"
  },
  {
    id: 11,
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    isbn: "9780807014295",
    tags: ["sinn_philosophie", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["story", "reflektierend", "anspruchsvoll"],
    description: "Ein Überlebender des Holocaust über den Sinn des Lebens.",
    coverColor: "bg-stone-100",
    ageGroup: "erwachsene"
  },
  {
    id: 12,
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    isbn: "9780143127741",
    tags: ["koerper_gesundheit", "stress_ruhe", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["wissenschaftlich", "anspruchsvoll"],
    description: "Wie Trauma im Körper gespeichert wird und wie Heilung gelingt.",
    coverColor: "bg-red-100",
    ageGroup: "erwachsene"
  },
  {
    id: 13,
    title: "Die 4-Stunden-Woche",
    author: "Timothy Ferriss",
    isbn: "9783548375960",
    tags: ["finanzen_organisation", "fokus_produktivitaet"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["praktisch"],
    description: "Mehr Zeit, mehr Geld, mehr Leben.",
    coverColor: "bg-yellow-100",
    ageGroup: "erwachsene"
  },
  {
    id: 14,
    title: "Meditations",
    author: "Marcus Aurelius",
    isbn: "9780140449334",
    tags: ["sinn_philosophie", "stress_ruhe", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["reflektierend", "anspruchsvoll"],
    description: "Zeitlose Weisheit eines römischen Kaisers.",
    coverColor: "bg-amber-100",
    ageGroup: "erwachsene"
  },
  {
    id: 15,
    title: "Kreativität",
    author: "Melanie Raabe",
    isbn: "9783442163328",
    tags: ["kreativitaet", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "praktisch"],
    description: "Wie sie uns mutiger, glücklicher und stärker macht.",
    coverColor: "bg-fuchsia-100",
    ageGroup: "erwachsene"
  },
  {
    id: 16,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    isbn: "9783570552698",
    tags: ["lernen_wissen", "sinn_philosophie"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["wissenschaftlich", "anspruchsvoll"],
    description: "Eine kurze Geschichte der Menschheit.",
    coverColor: "bg-blue-100",
    ageGroup: "erwachsene"
  },
  {
    id: 17,
    title: "The Power of Now",
    author: "Eckhart Tolle",
    isbn: "9781577314806",
    tags: ["stress_ruhe", "sinn_philosophie", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["reflektierend", "praktisch"],
    description: "Ein Leitfaden zum spirituellen Erwachen.",
    coverColor: "bg-purple-100",
    ageGroup: "erwachsene"
  },
  {
    id: 18,
    title: "Daring Greatly",
    author: "Brené Brown",
    isbn: "9781592408412",
    tags: ["persoenliche_entwicklung", "beziehung_kommunikation"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["wissenschaftlich", "story"],
    description: "Wie der Mut zur Verletzlichkeit unser Leben verändert.",
    coverColor: "bg-rose-100",
    ageGroup: "erwachsene"
  },
  {
    id: 19,
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    isbn: "9781982137274",
    tags: ["persoenliche_entwicklung", "fokus_produktivitaet", "finanzen_organisation"],
    difficulty: "einsteiger",
    timeEffort: "lang",
    style: ["praktisch"],
    description: "Zeitlose Prinzipien für persönlichen und beruflichen Erfolg.",
    coverColor: "bg-green-100",
    ageGroup: "erwachsene"
  },
  {
    id: 20,
    title: "Mindset",
    author: "Carol Dweck",
    isbn: "9780345472328",
    tags: ["persoenliche_entwicklung", "lernen_wissen"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["wissenschaftlich", "praktisch"],
    description: "Die neue Psychologie des Erfolgs.",
    coverColor: "bg-indigo-100",
    ageGroup: "erwachsene"
  },
  {
    id: 21,
    title: "Big Magic",
    author: "Elizabeth Gilbert",
    isbn: "9781594634727",
    tags: ["kreativitaet", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "praktisch"],
    description: "Nimm dein Leben in die Hand und es wird dir gelingen.",
    coverColor: "bg-pink-100",
    ageGroup: "erwachsene"
  },
  {
    id: 22,
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    isbn: "9780062457714",
    tags: ["persoenliche_entwicklung", "sinn_philosophie"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["praktisch", "kurz"],
    description: "Ein kontraintuitiver Ansatz für ein gutes Leben.",
    coverColor: "bg-orange-100",
    ageGroup: "erwachsene"
  },
  {
    id: 23,
    title: "Range",
    author: "David Epstein",
    isbn: "9780735214484",
    tags: ["lernen_wissen", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["wissenschaftlich"],
    description: "Warum Generalisten in einer spezialisierten Welt erfolgreicher sind.",
    coverColor: "bg-teal-100",
    ageGroup: "erwachsene"
  },
  {
    id: 24,
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    isbn: "9780671027032",
    tags: ["beziehung_kommunikation", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["praktisch"],
    description: "Der Klassiker über zwischenmenschliche Beziehungen.",
    coverColor: "bg-amber-100",
    ageGroup: "erwachsene"
  },
  {
    id: 25,
    title: "Why We Sleep",
    author: "Matthew Walker",
    isbn: "9781501144318",
    tags: ["koerper_gesundheit", "lernen_wissen"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["wissenschaftlich", "anspruchsvoll"],
    description: "Die neue Wissenschaft vom Schlaf und Träumen.",
    coverColor: "bg-blue-100",
    ageGroup: "erwachsene"
  },
  {
    id: 26,
    title: "Grit",
    author: "Angela Duckworth",
    isbn: "9781501111112",
    tags: ["persoenliche_entwicklung", "fokus_produktivitaet"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["wissenschaftlich", "praktisch"],
    description: "Die Kraft der Leidenschaft und Ausdauer.",
    coverColor: "bg-red-100",
    ageGroup: "erwachsene"
  },
  {
    id: 27,
    title: "Flow",
    author: "Mihaly Csikszentmihalyi",
    isbn: "9780061339202",
    tags: ["persoenliche_entwicklung", "fokus_produktivitaet", "sinn_philosophie"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["wissenschaftlich", "anspruchsvoll"],
    description: "Das Geheimnis des Glücks.",
    coverColor: "bg-cyan-100",
    ageGroup: "erwachsene"
  },
  {
    id: 28,
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "9780062315007",
    tags: ["sinn_philosophie", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story", "reflektierend"],
    description: "Eine zeitlose Parabel über das Verfolgen der eigenen Träume.",
    coverColor: "bg-yellow-100",
    ageGroup: "erwachsene"
  },
  {
    id: 29,
    title: "Educated",
    author: "Tara Westover",
    isbn: "9780399590504",
    tags: ["persoenliche_entwicklung", "lernen_wissen"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["story"],
    description: "Eine wahre Geschichte über Bildung und Selbstfindung.",
    coverColor: "bg-stone-100",
    ageGroup: "erwachsene"
  },
  {
    id: 30,
    title: "The War of Art",
    author: "Steven Pressfield",
    isbn: "9781936891023",
    tags: ["kreativitaet", "fokus_produktivitaet"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["praktisch", "kurz"],
    description: "Gewinne den inneren kreativen Kampf.",
    coverColor: "bg-violet-100",
    ageGroup: "erwachsene"
  },
  // Bücher für Kinder (6-12 Jahre)
  {
    id: 31,
    title: "Der kleine Prinz",
    author: "Antoine de Saint-Exupéry",
    isbn: "9783792000168",
    tags: ["freundschaft", "abenteuer", "philosophie"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story", "reflektierend"],
    description: "Die Geschichte eines kleinen Prinzen und seiner Reise durch die Galaxie.",
    coverColor: "bg-yellow-100",
    ageGroup: "kinder"
  },
  {
    id: 32,
    title: "Das magische Baumhaus",
    author: "Mary Pope Osborne",
    isbn: "9783785558003",
    tags: ["abenteuer", "geschichte", "magie"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story"],
    description: "Zeitreise-Abenteuer von Anne und Philipp mit einem magischen Baumhaus.",
    coverColor: "bg-green-100",
    ageGroup: "kinder"
  },
  {
    id: 33,
    title: "Greg's Tagebuch",
    author: "Jeff Kinney",
    isbn: "9783843200080",
    tags: ["freundschaft", "schule", "lustiges"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story", "kurz"],
    description: "Die lustigen Alltagsabenteuer von Greg Heffley.",
    coverColor: "bg-orange-100",
    ageGroup: "kinder"
  },
  {
    id: 34,
    title: "Die Schule der magischen Tiere",
    author: "Margit Auer",
    isbn: "9783551652003",
    tags: ["freundschaft", "magie", "schule"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story"],
    description: "Kinder bekommen magische Tiere als beste Freunde.",
    coverColor: "bg-pink-100",
    ageGroup: "kinder"
  },
  {
    id: 35,
    title: "Harry Potter und der Stein der Weisen",
    author: "J.K. Rowling",
    isbn: "9783551551672",
    tags: ["abenteuer", "magie", "freundschaft"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story"],
    description: "Harry entdeckt, dass er ein Zauberer ist und besucht Hogwarts.",
    coverColor: "bg-purple-100",
    ageGroup: "kinder"
  },
  {
    id: 36,
    title: "Matilda",
    author: "Roald Dahl",
    isbn: "9783499217364",
    tags: ["schule", "magie", "mut"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story"],
    description: "Ein Mädchen mit besonderen Fähigkeiten und einer großen Liebe zu Büchern.",
    coverColor: "bg-blue-100",
    ageGroup: "kinder"
  },
  {
    id: 37,
    title: "Der Räuber Hotzenplotz",
    author: "Otfried Preußler",
    isbn: "9783522101509",
    tags: ["abenteuer", "lustiges", "mut"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story"],
    description: "Kasperl und Seppel auf der Jagd nach dem berüchtigten Räuber.",
    coverColor: "bg-red-100",
    ageGroup: "kinder"
  },
  {
    id: 38,
    title: "Paddington",
    author: "Michael Bond",
    isbn: "9783570175415",
    tags: ["abenteuer", "freundschaft", "lustiges"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story"],
    description: "Ein Bär aus Peru erlebt Abenteuer in London.",
    coverColor: "bg-amber-100",
    ageGroup: "kinder"
  },
  // Bücher für Jugendliche (13-17 Jahre)
  {
    id: 39,
    title: "Die Tribute von Panem",
    author: "Suzanne Collins",
    isbn: "9783789132313",
    tags: ["abenteuer", "mut", "gesellschaft"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["story"],
    description: "Katniss kämpft ums Überleben in einem brutalen Wettbewerb.",
    coverColor: "bg-slate-100",
    ageGroup: "jugendliche"
  },
  {
    id: 40,
    title: "Das Schicksal ist ein mieser Verräter",
    author: "John Green",
    isbn: "9783446240094",
    tags: ["freundschaft", "liebe", "leben"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "reflektierend"],
    description: "Eine berührende Geschichte über Liebe und das Leben.",
    coverColor: "bg-cyan-100",
    ageGroup: "jugendliche"
  },
  {
    id: 41,
    title: "Tschick",
    author: "Wolfgang Herrndorf",
    isbn: "9783499256356",
    tags: ["freundschaft", "abenteuer", "selbstfindung"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story"],
    description: "Zwei Außenseiter auf einem unvergesslichen Roadtrip.",
    coverColor: "bg-teal-100",
    ageGroup: "jugendliche"
  },
  {
    id: 42,
    title: "Percy Jackson - Diebe im Olymp",
    author: "Rick Riordan",
    isbn: "9783551313010",
    tags: ["abenteuer", "magie", "geschichte"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story"],
    description: "Percy entdeckt, dass er der Sohn eines griechischen Gottes ist.",
    coverColor: "bg-indigo-100",
    ageGroup: "jugendliche"
  },
  {
    id: 43,
    title: "Die Outsider",
    author: "S.E. Hinton",
    isbn: "9783423781305",
    tags: ["freundschaft", "gesellschaft", "mut"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story"],
    description: "Klassischer Roman über Jugendliche und soziale Konflikte.",
    coverColor: "bg-stone-100",
    ageGroup: "jugendliche"
  },
  {
    id: 44,
    title: "Eleanor & Park",
    author: "Rainbow Rowell",
    isbn: "9783446247130",
    tags: ["liebe", "freundschaft", "selbstfindung"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story"],
    description: "Eine zarte Liebesgeschichte zweier Außenseiter.",
    coverColor: "bg-rose-100",
    ageGroup: "jugendliche"
  },
  {
    id: 45,
    title: "Selection",
    author: "Kiera Cass",
    isbn: "9783596196944",
    tags: ["liebe", "abenteuer", "selbstfindung"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story"],
    description: "35 Mädchen wetteifern um das Herz des Prinzen.",
    coverColor: "bg-pink-100",
    ageGroup: "jugendliche"
  }
];

export const getMatchingBooks = (profile) => {
  const { mainTopics, secondaryTopics, style, difficulty, ageGroup } = profile;
  
  // Zuerst nach Altersgruppe filtern
  const ageFilteredBooks = books.filter(book => book.ageGroup === ageGroup);
  
  const scoredBooks = ageFilteredBooks.map(book => {
    let score = 0;
    
    // Hauptthemen (höchste Gewichtung)
    mainTopics.forEach(topic => {
      if (book.tags.includes(topic)) score += 5;
    });
    
    // Sekundäre Themen
    secondaryTopics.forEach(topic => {
      if (book.tags.includes(topic)) score += 2;
    });
    
    // Stil-Match
    style.forEach(s => {
      if (book.style.includes(s)) score += 3;
    });
    
    // Schwierigkeits-Match
    if (book.difficulty === difficulty) score += 4;
    if (
      (difficulty === "fortgeschritten" && book.difficulty === "einsteiger") ||
      (difficulty === "einsteiger" && book.difficulty === "fortgeschritten")
    ) {
      score -= 2;
    }
    
    return { ...book, score };
  });
  
  // Sortieren und Top 4 auswählen
  const sorted = scoredBooks.sort((a, b) => b.score - a.score);
  const topBooks = sorted.slice(0, 4);
  
  // Kontrast-Buch finden (niedrigerer Score, aber thematisch verbunden)
  const usedIds = topBooks.map(b => b.id);
  const contrastBook = sorted
    .filter(b => !usedIds.includes(b.id) && b.score > 0)
    .find(b => {
      // Anderer Stil als bevorzugt
      const hasDifferentStyle = !style.some(s => b.style.includes(s));
      return hasDifferentStyle;
    }) || sorted.find(b => !usedIds.includes(b.id));
  
  return {
    recommendations: topBooks,
    contrastBook: contrastBook ? { ...contrastBook, isContrast: true } : null
  };
};