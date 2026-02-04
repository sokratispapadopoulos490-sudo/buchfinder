// Buchdatenbank mit Tags und Metadaten
export const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    tags: ["persoenliche_entwicklung", "fokus_produktivitaet", "praktisch"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["praktisch", "wissenschaftlich"],
    description: "Wie kleine Gewohnheiten große Veränderungen bewirken.",
    link: "https://www.amazon.de/dp/3442178584",
    coverColor: "bg-amber-100"
  },
  {
    id: 2,
    title: "Die Kunst des klaren Denkens",
    author: "Rolf Dobelli",
    tags: ["lernen_wissen", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["praktisch", "kurz"],
    description: "52 Denkfehler, die man besser anderen überlässt.",
    link: "https://www.amazon.de/dp/3423348267",
    coverColor: "bg-slate-100"
  },
  {
    id: 3,
    title: "Der Weg des Künstlers",
    author: "Julia Cameron",
    tags: ["kreativitaet", "persoenliche_entwicklung", "sinn_philosophie"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["praktisch", "reflektierend"],
    description: "Ein 12-Wochen-Programm zur Entfaltung der kreativen Kräfte.",
    link: "https://www.amazon.de/dp/3426875047",
    coverColor: "bg-violet-100"
  },
  {
    id: 4,
    title: "Stille",
    author: "Erling Kagge",
    tags: ["stress_ruhe", "sinn_philosophie"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["reflektierend", "kurz"],
    description: "Ein Entdecker über die Stille in einer lauten Welt.",
    link: "https://www.amazon.de/dp/3458363912",
    coverColor: "bg-sky-100"
  },
  {
    id: 5,
    title: "Deep Work",
    author: "Cal Newport",
    tags: ["fokus_produktivitaet", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["wissenschaftlich", "praktisch"],
    description: "Regeln für konzentriertes Arbeiten in einer zerstreuten Welt.",
    link: "https://www.amazon.de/dp/3868816577",
    coverColor: "bg-indigo-100"
  },
  {
    id: 6,
    title: "Gewaltfreie Kommunikation",
    author: "Marshall B. Rosenberg",
    tags: ["beziehung_kommunikation", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "lang",
    style: ["praktisch", "wissenschaftlich"],
    description: "Eine Sprache des Lebens für tiefere Verbindungen.",
    link: "https://www.amazon.de/dp/3955713008",
    coverColor: "bg-rose-100"
  },
  {
    id: 7,
    title: "Der Mönch, der seinen Ferrari verkaufte",
    author: "Robin Sharma",
    tags: ["sinn_philosophie", "persoenliche_entwicklung", "stress_ruhe"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "reflektierend"],
    description: "Eine Parabel über die Erfüllung von Träumen.",
    link: "https://www.amazon.de/dp/3426874830",
    coverColor: "bg-orange-100"
  },
  {
    id: 8,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    tags: ["lernen_wissen", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["wissenschaftlich", "anspruchsvoll"],
    description: "Wie wir denken: schnell, intuitiv, langsam, rational.",
    link: "https://www.amazon.de/dp/3328100342",
    coverColor: "bg-emerald-100"
  },
  {
    id: 9,
    title: "Ikigai",
    author: "Héctor García & Francesc Miralles",
    tags: ["sinn_philosophie", "koerper_gesundheit", "stress_ruhe"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["reflektierend", "kurz"],
    description: "Das japanische Geheimnis für ein langes, glückliches Leben.",
    link: "https://www.amazon.de/dp/3548060900",
    coverColor: "bg-pink-100"
  },
  {
    id: 10,
    title: "Essentialism",
    author: "Greg McKeown",
    tags: ["fokus_produktivitaet", "stress_ruhe", "finanzen_organisation"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["praktisch", "kurz"],
    description: "Weniger, aber besser: Die disziplinierte Verfolgung des Wesentlichen.",
    link: "https://www.amazon.de/dp/3868815783",
    coverColor: "bg-teal-100"
  },
  {
    id: 11,
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    tags: ["sinn_philosophie", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["story", "reflektierend", "anspruchsvoll"],
    description: "Ein Überlebender des Holocaust über den Sinn des Lebens.",
    link: "https://www.amazon.de/dp/3328102779",
    coverColor: "bg-stone-100"
  },
  {
    id: 12,
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    tags: ["koerper_gesundheit", "stress_ruhe", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["wissenschaftlich", "anspruchsvoll"],
    description: "Wie Trauma im Körper gespeichert wird und wie Heilung gelingt.",
    link: "https://www.amazon.de/dp/0143127748",
    coverColor: "bg-red-100"
  },
  {
    id: 13,
    title: "Die 4-Stunden-Woche",
    author: "Timothy Ferriss",
    tags: ["finanzen_organisation", "fokus_produktivitaet"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["praktisch"],
    description: "Mehr Zeit, mehr Geld, mehr Leben.",
    link: "https://www.amazon.de/dp/3548375960",
    coverColor: "bg-yellow-100"
  },
  {
    id: 14,
    title: "Meditations",
    author: "Marcus Aurelius",
    tags: ["sinn_philosophie", "stress_ruhe", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["reflektierend", "anspruchsvoll"],
    description: "Zeitlose Weisheit eines römischen Kaisers.",
    link: "https://www.amazon.de/dp/3150193044",
    coverColor: "bg-amber-100"
  },
  {
    id: 15,
    title: "Kreativität",
    author: "Melanie Raabe",
    tags: ["kreativitaet", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "praktisch"],
    description: "Wie sie uns mutiger, glücklicher und stärker macht.",
    link: "https://www.amazon.de/dp/3442316332",
    coverColor: "bg-fuchsia-100"
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