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
    coverColor: "bg-amber-100"
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
    coverColor: "bg-slate-100"
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
    coverColor: "bg-violet-100"
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
    coverColor: "bg-sky-100"
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
    coverColor: "bg-indigo-100"
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
    coverColor: "bg-rose-100"
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
    coverColor: "bg-orange-100"
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
    coverColor: "bg-emerald-100"
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
    coverColor: "bg-pink-100"
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
    coverColor: "bg-teal-100"
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
    coverColor: "bg-stone-100"
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
    coverColor: "bg-red-100"
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
    coverColor: "bg-yellow-100"
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
    coverColor: "bg-amber-100"
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
    coverColor: "bg-fuchsia-100"
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
    coverColor: "bg-blue-100"
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
    coverColor: "bg-purple-100"
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
    coverColor: "bg-rose-100"
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
    coverColor: "bg-green-100"
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
    coverColor: "bg-indigo-100"
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
    coverColor: "bg-pink-100"
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
    coverColor: "bg-orange-100"
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
    coverColor: "bg-teal-100"
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
    coverColor: "bg-amber-100"
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
    coverColor: "bg-blue-100"
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
    coverColor: "bg-red-100"
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
    coverColor: "bg-cyan-100"
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
    coverColor: "bg-yellow-100"
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
    coverColor: "bg-stone-100"
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
    coverColor: "bg-violet-100"
  }
];

export const getMatchingBooks = (profile) => {
  const { mainTopics, secondaryTopics, style, difficulty } = profile;
  
  const scoredBooks = books.map(book => {
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