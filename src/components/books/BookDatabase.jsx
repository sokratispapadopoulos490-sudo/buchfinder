// Buchdatenbank mit Tags und Metadaten
export const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9783442178582",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    pageCount: 320,
    publishYear: 2018,
    publisher: "Goldmann",
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
    coverUrl: "https://covers.openlibrary.org/b/isbn/9783423348263-L.jpg",
    pageCount: 256,
    publishYear: 2011,
    publisher: "dtv",
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
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780874776942-L.jpg",
    pageCount: 304,
    publishYear: 1992,
    publisher: "Droemer Knaur",
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
  },
  // Fantasy & Science Fiction für Erwachsene
  {
    id: 46,
    title: "Der Name des Windes",
    author: "Patrick Rothfuss",
    isbn: "9783608938081",
    tags: ["fantasy_scifi", "abenteuer"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story", "anspruchsvoll"],
    description: "Die epische Geschichte von Kvothe, einem legendären Magier und Abenteurer.",
    coverColor: "bg-purple-100",
    ageGroup: "erwachsene"
  },
  {
    id: 47,
    title: "Der Herr der Ringe",
    author: "J.R.R. Tolkien",
    isbn: "9783608938043",
    tags: ["fantasy_scifi", "abenteuer"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story", "anspruchsvoll"],
    description: "Das zeitlose Fantasy-Epos über die Gefährten und ihre Quest.",
    coverColor: "bg-green-100",
    ageGroup: "erwachsene"
  },
  {
    id: 48,
    title: "Die Säulen der Erde",
    author: "Ken Follett",
    isbn: "9783404144532",
    tags: ["historisch", "drama"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story"],
    description: "Mitreißender historischer Roman über den Bau einer Kathedrale im Mittelalter.",
    coverColor: "bg-stone-100",
    ageGroup: "erwachsene"
  },
  {
    id: 49,
    title: "1984",
    author: "George Orwell",
    isbn: "9783548234106",
    tags: ["fantasy_scifi", "gesellschaft", "literatur"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["story", "reflektierend"],
    description: "Dystopischer Klassiker über Überwachung und Totalitarismus.",
    coverColor: "bg-slate-100",
    ageGroup: "erwachsene"
  },
  {
    id: 50,
    title: "Das Lied von Eis und Feuer",
    author: "George R.R. Martin",
    isbn: "9783442267743",
    tags: ["fantasy_scifi", "abenteuer", "drama"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story", "anspruchsvoll"],
    description: "Epische Fantasy-Saga mit komplexen Charakteren und politischen Intrigen.",
    coverColor: "bg-red-100",
    ageGroup: "erwachsene"
  },
  {
    id: 51,
    title: "Die Nebel von Avalon",
    author: "Marion Zimmer Bradley",
    isbn: "9783596223312",
    tags: ["fantasy_scifi", "historisch", "magie"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story", "reflektierend"],
    description: "Die Artus-Sage aus der Perspektive der Frauen erzählt.",
    coverColor: "bg-violet-100",
    ageGroup: "erwachsene"
  },
  {
    id: 52,
    title: "Dune - Der Wüstenplanet",
    author: "Frank Herbert",
    isbn: "9783453316775",
    tags: ["fantasy_scifi", "abenteuer"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story", "anspruchsvoll"],
    description: "Science-Fiction-Meisterwerk über Politik, Religion und Ökologie.",
    coverColor: "bg-amber-100",
    ageGroup: "erwachsene"
  },
  {
    id: 53,
    title: "Die Chroniken von Narnia",
    author: "C.S. Lewis",
    isbn: "9783596522774",
    tags: ["fantasy_scifi", "abenteuer", "magie"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story"],
    description: "Magische Abenteuer in der Welt hinter dem Kleiderschrank.",
    coverColor: "bg-cyan-100",
    ageGroup: "erwachsene"
  },
  // Thriller & Krimis
  {
    id: 54,
    title: "Verblendung",
    author: "Stieg Larsson",
    isbn: "9783453436046",
    tags: ["thriller_krimi", "spannung"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story"],
    description: "Spannender Thriller über eine Journalistin und einen mysteriösen Fall.",
    coverColor: "bg-red-100",
    ageGroup: "erwachsene"
  },
  {
    id: 55,
    title: "Die Verschwörung",
    author: "Dan Brown",
    isbn: "9783785724316",
    tags: ["thriller_krimi", "abenteuer", "lernen_wissen"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story"],
    description: "Robert Langdon jagt durch Europa auf der Suche nach Hinweisen.",
    coverColor: "bg-brown-100",
    ageGroup: "erwachsene"
  },
  {
    id: 56,
    title: "Gone Girl",
    author: "Gillian Flynn",
    isbn: "9783596189229",
    tags: ["thriller_krimi", "spannung", "drama"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["story"],
    description: "Psychothriller über eine verschwundene Frau und ihren Ehemann.",
    coverColor: "bg-slate-100",
    ageGroup: "erwachsene"
  },
  {
    id: 57,
    title: "Tausend strahlende Sonnen",
    author: "Khaled Hosseini",
    isbn: "9783596512546",
    tags: ["literatur", "drama", "historisch"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["story", "reflektierend"],
    description: "Bewegende Geschichte zweier Frauen im kriegsgebeutelten Afghanistan.",
    coverColor: "bg-orange-100",
    ageGroup: "erwachsene"
  },
  // Romance
  {
    id: 58,
    title: "Stolz und Vorurteil",
    author: "Jane Austen",
    isbn: "9783150000496",
    tags: ["romance", "literatur", "historisch"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["story", "reflektierend"],
    description: "Klassischer Liebesroman über Elizabeth Bennet und Mr. Darcy.",
    coverColor: "bg-pink-100",
    ageGroup: "erwachsene"
  },
  {
    id: 59,
    title: "Wie ein Licht in dunkler Nacht",
    author: "Jojo Moyes",
    isbn: "9783499266126",
    tags: ["romance", "drama"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story"],
    description: "Berührende Liebesgeschichte über eine Pflegerin und ihren Patienten.",
    coverColor: "bg-rose-100",
    ageGroup: "erwachsene"
  },
  {
    id: 60,
    title: "Die Seiten der Welt",
    author: "Kai Meyer",
    isbn: "9783841423344",
    tags: ["fantasy_scifi", "romance", "abenteuer"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story"],
    description: "Fantasy-Romance über zwei Jugendliche in einer Welt voller Bücher.",
    coverColor: "bg-teal-100",
    ageGroup: "erwachsene"
  },
  // Humor & Leichte Unterhaltung
  {
    id: 61,
    title: "Der Hundertjährige, der aus dem Fenster stieg",
    author: "Jonas Jonasson",
    isbn: "9783570585016",
    tags: ["humor", "abenteuer"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "kurz"],
    description: "Absurd-komische Geschichte eines Hundertjährigen auf der Flucht.",
    coverColor: "bg-yellow-100",
    ageGroup: "erwachsene"
  },
  {
    id: 62,
    title: "Ziemlich beste Freunde",
    author: "Philippe Pozzo di Borgo",
    isbn: "9783446238350",
    tags: ["humor", "freundschaft", "drama"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story"],
    description: "Wahre Geschichte einer außergewöhnlichen Freundschaft.",
    coverColor: "bg-blue-100",
    ageGroup: "erwachsene"
  },
  // Anspruchsvolle Literatur
  {
    id: 63,
    title: "Die unerträgliche Leichtigkeit des Seins",
    author: "Milan Kundera",
    isbn: "9783596512454",
    tags: ["literatur", "sinn_philosophie", "romance"],
    difficulty: "erfahren",
    timeEffort: "mittel",
    style: ["story", "reflektierend", "anspruchsvoll"],
    description: "Philosophischer Roman über Liebe und Existenz im kommunistischen Prag.",
    coverColor: "bg-stone-100",
    ageGroup: "erwachsene"
  },
  {
    id: 64,
    title: "Der Schatten des Windes",
    author: "Carlos Ruiz Zafón",
    isbn: "9783518463031",
    tags: ["literatur", "thriller_krimi", "historisch"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story", "anspruchsvoll"],
    description: "Mysteriöser Roman über einen Jungen und ein vergessenes Buch im Barcelona der Nachkriegszeit.",
    coverColor: "bg-indigo-100",
    ageGroup: "erwachsene"
  },
  {
    id: 65,
    title: "Die Vermessung der Welt",
    author: "Daniel Kehlmann",
    isbn: "9783499243509",
    tags: ["literatur", "historisch", "lernen_wissen"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["story", "reflektierend"],
    description: "Fiktive Doppelbiografie von Alexander von Humboldt und Carl Friedrich Gauß.",
    coverColor: "bg-emerald-100",
    ageGroup: "erwachsene"
  },
  // Yoga & Achtsamkeit
  {
    id: 66,
    title: "Das Yoga Sutra nach Patanjali",
    author: "Patanjali",
    isbn: "9783442219704",
    tags: ["koerper_gesundheit", "stress_ruhe", "sinn_philosophie"],
    difficulty: "fortgeschritten",
    timeEffort: "mittel",
    style: ["reflektierend", "praktisch"],
    description: "Der klassische Leitfaden des Yoga - Philosophie und Praxis.",
    coverColor: "bg-cyan-100",
    ageGroup: "erwachsene"
  },
  {
    id: 67,
    title: "Yoga Anatomie",
    author: "Leslie Kaminoff",
    isbn: "9783868836622",
    tags: ["koerper_gesundheit", "lernen_wissen"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["wissenschaftlich", "praktisch"],
    description: "Detaillierte anatomische Erklärung der Yoga-Asanas.",
    coverColor: "bg-green-100",
    ageGroup: "erwachsene"
  },
  {
    id: 68,
    title: "Licht auf Yoga",
    author: "B.K.S. Iyengar",
    isbn: "9783426291252",
    tags: ["koerper_gesundheit", "stress_ruhe"],
    difficulty: "einsteiger",
    timeEffort: "lang",
    style: ["praktisch"],
    description: "Der umfassende Klassiker zur Yoga-Praxis mit über 600 Fotos.",
    coverColor: "bg-amber-100",
    ageGroup: "erwachsene"
  },
  {
    id: 69,
    title: "Der Pfad des friedvollen Kriegers",
    author: "Dan Millman",
    isbn: "9783442219711",
    tags: ["koerper_gesundheit", "sinn_philosophie", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "reflektierend"],
    description: "Inspirierende Geschichte über spirituelle Transformation und körperliche Meisterschaft.",
    coverColor: "bg-purple-100",
    ageGroup: "erwachsene"
  },
  {
    id: 70,
    title: "Yoga für den Alltag",
    author: "Anna Trökes",
    isbn: "9783833866838",
    tags: ["koerper_gesundheit", "stress_ruhe"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["praktisch", "kurz"],
    description: "Praktischer Ratgeber für Yoga-Übungen im täglichen Leben.",
    coverColor: "bg-teal-100",
    ageGroup: "erwachsene"
  },
  // Weitere Belletristik
  {
    id: 71,
    title: "Die unendliche Geschichte",
    author: "Michael Ende",
    isbn: "9783522202015",
    tags: ["fantasy_scifi", "abenteuer"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story"],
    description: "Bastian wird in die magische Welt Phantásien hineingezogen.",
    coverColor: "bg-purple-100",
    ageGroup: "kinder"
  },
  {
    id: 72,
    title: "Momo",
    author: "Michael Ende",
    isbn: "9783522202046",
    tags: ["freundschaft", "zeit", "philosophie"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "reflektierend"],
    description: "Momo kämpft gegen die grauen Herren, die den Menschen die Zeit stehlen.",
    coverColor: "bg-orange-100",
    ageGroup: "kinder"
  },
  {
    id: 73,
    title: "Die Chroniken von Akakor",
    author: "Kai Meyer",
    isbn: "9783596806713",
    tags: ["abenteuer", "historisch"],
    difficulty: "fortgeschritten",
    timeEffor: "lang",
    style: ["story"],
    description: "Geheimnisvolle Expedition in den Amazonas-Dschungel.",
    coverColor: "bg-green-100",
    ageGroup: "jugendliche"
  },
  {
    id: 74,
    title: "Die Mitternachtsbibliothek",
    author: "Matt Haig",
    isbn: "9783426282632",
    tags: ["literatur", "sinn_philosophie", "selbstfindung"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "reflektierend"],
    description: "Eine Bibliothek zwischen Leben und Tod, in der jedes Buch ein anderes Leben zeigt.",
    coverColor: "bg-indigo-100",
    ageGroup: "erwachsene"
  },
  {
    id: 75,
    title: "Der Schwarm",
    author: "Frank Schätzing",
    isbn: "9783596162709",
    tags: ["thriller_krimi", "fantasy_scifi", "lernen_wissen"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story", "anspruchsvoll"],
    description: "Wissenschafts-Thriller über eine Bedrohung aus den Tiefen der Ozeane.",
    coverColor: "bg-blue-100",
    ageGroup: "erwachsene"
  },
  {
    id: 76,
    title: "Der Medicus",
    author: "Noah Gordon",
    isbn: "9783453471283",
    tags: ["historisch", "abenteuer", "lernen_wissen"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story"],
    description: "Rob Cole reist ins mittelalterliche Persien, um Medizin zu studieren.",
    coverColor: "bg-amber-100",
    ageGroup: "erwachsene"
  },
  {
    id: 77,
    title: "Eragon - Das Vermächtnis der Drachenreiter",
    author: "Christopher Paolini",
    isbn: "9783570127773",
    tags: ["fantasy_scifi", "abenteuer"],
    difficulty: "einsteiger",
    timeEffort: "lang",
    style: ["story"],
    description: "Ein Bauernjunge findet ein Drachenei und wird zum Drachenreiter.",
    coverColor: "bg-red-100",
    ageGroup: "jugendliche"
  },
  {
    id: 78,
    title: "Die Wolke",
    author: "Gudrun Pausewang",
    isbn: "9783473582341",
    tags: ["gesellschaft", "drama"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story"],
    description: "Eindringliche Geschichte über ein Atomunglück und seine Folgen.",
    coverColor: "bg-gray-100",
    ageGroup: "jugendliche"
  },
  {
    id: 79,
    title: "Der Junge im gestreiften Pyjama",
    author: "John Boyne",
    isbn: "9783596806836",
    tags: ["historisch", "drama", "freundschaft"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story"],
    description: "Berührende Geschichte über Freundschaft während des Holocausts.",
    coverColor: "bg-stone-100",
    ageGroup: "jugendliche"
  },
  {
    id: 80,
    title: "Die Welle",
    author: "Morton Rhue",
    isbn: "9783473580088",
    tags: ["gesellschaft", "lernen_wissen"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story"],
    description: "Experiment über Gruppendynamik und Manipulation.",
    coverColor: "bg-slate-100",
    ageGroup: "jugendliche"
  },
  // Weitere Sachbücher
  {
    id: 81,
    title: "Eine kurze Geschichte der Zeit",
    author: "Stephen Hawking",
    isbn: "9783499626005",
    tags: ["lernen_wissen", "sinn_philosophie"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["wissenschaftlich", "anspruchsvoll"],
    description: "Hawking erklärt das Universum verständlich.",
    coverColor: "bg-violet-100",
    ageGroup: "erwachsene"
  },
  {
    id: 82,
    title: "Factfulness",
    author: "Hans Rosling",
    isbn: "9783548377278",
    tags: ["lernen_wissen", "gesellschaft"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["wissenschaftlich", "praktisch"],
    description: "Warum wir die Welt systematisch falsch sehen.",
    coverColor: "bg-green-100",
    ageGroup: "erwachsene"
  },
  {
    id: 83,
    title: "21 Lektionen für das 21. Jahrhundert",
    author: "Yuval Noah Harari",
    isbn: "9783406727788",
    tags: ["lernen_wissen", "gesellschaft", "sinn_philosophie"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["wissenschaftlich", "reflektierend"],
    description: "Harari analysiert die großen Fragen unserer Zeit.",
    coverColor: "bg-blue-100",
    ageGroup: "erwachsene"
  },
  {
    id: 84,
    title: "Das Leben und das Schreiben",
    author: "Stephen King",
    isbn: "9783453435742",
    tags: ["kreativitaet", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "praktisch"],
    description: "Kings Autobiografie und Schreibratgeber in einem.",
    coverColor: "bg-orange-100",
    ageGroup: "erwachsene"
  },
  {
    id: 85,
    title: "Rebellische Trauer",
    author: "Megan Devine",
    isbn: "9783466347513",
    tags: ["persoenliche_entwicklung", "stress_ruhe"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["praktisch", "reflektierend"],
    description: "Ein ehrlicher Begleiter durch den Trauerprozess.",
    coverColor: "bg-slate-100",
    ageGroup: "erwachsene"
    },
    // Glaube & Spiritualität
    {
    id: 86,
    title: "Die Bibel",
    author: "Diverse Autoren",
    isbn: "9783460440029",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9783460440029-L.jpg",
    pageCount: 1600,
    publishYear: 2016,
    publisher: "Katholisches Bibelwerk",
    tags: ["glaube_spiritualitaet", "sinn_philosophie"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["reflektierend", "anspruchsvoll"],
    description: "Das zentrale Buch des Christentums - Altes und Neues Testament.",
    coverColor: "bg-blue-100",
    ageGroup: "erwachsene"
    },
    {
    id: 87,
    title: "Gespräche mit Gott",
    author: "Neale Donald Walsch",
    isbn: "9783442217434",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780399142789-L.jpg",
    pageCount: 256,
    publishYear: 1995,
    publisher: "Goldmann",
    tags: ["glaube_spiritualitaet", "sinn_philosophie"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["reflektierend"],
    description: "Spirituelle Dialoge über das Leben und die großen Fragen der Menschheit.",
    coverColor: "bg-purple-100",
    ageGroup: "erwachsene"
    },
    {
    id: 88,
    title: "Die vier edlen Wahrheiten",
    author: "Dalai Lama",
    isbn: "9783596152506",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780722532690-L.jpg",
    pageCount: 176,
    publishYear: 1997,
    publisher: "Fischer",
    tags: ["glaube_spiritualitaet", "stress_ruhe", "sinn_philosophie"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["reflektierend", "praktisch"],
    description: "Der Dalai Lama erklärt die Grundlagen des Buddhismus.",
    coverColor: "bg-orange-100",
    ageGroup: "erwachsene"
    },
    {
    id: 89,
    title: "Siddhartha",
    author: "Hermann Hesse",
    isbn: "9783518366813",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9783518366813-L.jpg",
    pageCount: 152,
    publishYear: 1922,
    publisher: "Suhrkamp",
    tags: ["glaube_spiritualitaet", "sinn_philosophie", "literatur"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story", "reflektierend"],
    description: "Die spirituelle Reise eines jungen Mannes zur Erleuchtung.",
    coverColor: "bg-amber-100",
    ageGroup: "erwachsene"
    },
    {
    id: 90,
    title: "Der Prophet",
    author: "Khalil Gibran",
    isbn: "9783423140089",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780394404288-L.jpg",
    pageCount: 128,
    publishYear: 1923,
    publisher: "dtv",
    tags: ["glaube_spiritualitaet", "sinn_philosophie"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["reflektierend", "kurz"],
    description: "Poetische Weisheiten über Liebe, Leben, Tod und Spiritualität.",
    coverColor: "bg-teal-100",
    ageGroup: "erwachsene"
    },
    {
    id: 91,
    title: "Autobiographie eines Yogi",
    author: "Paramahansa Yogananda",
    isbn: "9780876120798",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780876120798-L.jpg",
    pageCount: 502,
    publishYear: 1946,
    publisher: "Self-Realization Fellowship",
    tags: ["glaube_spiritualitaet", "koerper_gesundheit", "persoenliche_entwicklung"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story", "reflektierend"],
    description: "Die spirituelle Lebensgeschichte eines indischen Yogis.",
    coverColor: "bg-indigo-100",
    ageGroup: "erwachsene"
    },
    {
    id: 92,
    title: "Das Café am Rande der Welt",
    author: "John Strelecky",
    isbn: "9783423209694",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9783423209694-L.jpg",
    pageCount: 128,
    publishYear: 2006,
    publisher: "dtv",
    tags: ["glaube_spiritualitaet", "sinn_philosophie", "persoenliche_entwicklung"],
    difficulty: "einsteiger",
    timeEffort: "kurz",
    style: ["story", "reflektierend"],
    description: "Eine inspirierende Geschichte über den Sinn des Lebens.",
    coverColor: "bg-cyan-100",
    ageGroup: "erwachsene"
    },
    {
    id: 93,
    title: "Die Hütte",
    author: "William P. Young",
    isbn: "9783548284644",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780964729230-L.jpg",
    pageCount: 304,
    publishYear: 2007,
    publisher: "Ullstein",
    tags: ["glaube_spiritualitaet", "sinn_philosophie"],
    difficulty: "einsteiger",
    timeEffort: "mittel",
    style: ["story", "reflektierend"],
    description: "Eine außergewöhnliche Begegnung mit Gott nach einer Tragödie.",
    coverColor: "bg-green-100",
    ageGroup: "erwachsene"
    },
    {
    id: 94,
    title: "Zen - oder die Kunst ein Motorrad zu warten",
    author: "Robert M. Pirsig",
    isbn: "9783596521623",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780060589462-L.jpg",
    pageCount: 544,
    publishYear: 1974,
    publisher: "Fischer",
    tags: ["glaube_spiritualitaet", "sinn_philosophie", "literatur"],
    difficulty: "fortgeschritten",
    timeEffort: "lang",
    style: ["story", "reflektierend", "anspruchsvoll"],
    description: "Eine philosophische Reise über Qualität und den Sinn des Lebens.",
    coverColor: "bg-stone-100",
    ageGroup: "erwachsene"
    }
    ];

export const getMatchingBooks = (profile) => {
  const { mainTopics, secondaryTopics, style, difficulty, ageGroup, readBooks = [], savedBookIds = [] } = profile;
  
  // Zuerst nach Altersgruppe filtern
  let ageFilteredBooks = books.filter(book => book.ageGroup === ageGroup);
  
  // Filtere bereits gespeicherte Bücher (in Bibliothek) heraus
  if (savedBookIds.length > 0) {
    ageFilteredBooks = ageFilteredBooks.filter(book => !savedBookIds.includes(book.id));
  }
  
  // Filtere manuell eingegebene gelesene Bücher aus
  if (readBooks.length > 0) {
    ageFilteredBooks = ageFilteredBooks.filter(book => {
      const bookTitleLower = book.title.toLowerCase();
      const bookAuthorLower = book.author.toLowerCase();
      return !readBooks.some(readBook => {
        const readBookLower = readBook.toLowerCase();
        return bookTitleLower.includes(readBookLower) || readBookLower.includes(bookTitleLower) ||
               bookAuthorLower.includes(readBookLower) || readBookLower.includes(bookAuthorLower);
      });
    });
  }
  
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
  
  // Sortieren
  const sorted = scoredBooks.sort((a, b) => b.score - a.score);
  
  // Top 10 passende Bücher (ohne isContrast)
  const topBooks = sorted.slice(0, 10).map((book, idx) => ({
    ...book,
    placement: idx + 1,
    isContrast: false
  }));

  // 3 Horizont-Erweiterungs-Bücher: niedrigsten Score aus ANDEREN Themen
  const topBookIds = new Set(topBooks.map(b => b.id));
  const remainingBooks = scoredBooks.filter(b => !topBookIds.has(b.id));
  
  // Bücher mit niedrigem Main-Topic-Match aber anderem Thema als Kontrast
  const contrastBooks = remainingBooks
    .filter(book => {
      // Nur Bücher, die NICHT hauptsächlich zum Hauptthema passen (echter Perspektivwechsel)
      const mainTopicMatch = mainTopics.some(t => book.tags.includes(t));
      return !mainTopicMatch;
    })
    .slice(0, 3)
    .map((book, idx) => ({
      ...book,
      placement: 11 + idx,
      isContrast: true
    }));

  // Falls nicht genug Kontrast-Bücher ohne Main-Topic, Rest auffüllen
  if (contrastBooks.length < 3) {
    const needed = 3 - contrastBooks.length;
    const contrastIds = new Set(contrastBooks.map(b => b.id));
    const filler = remainingBooks
      .filter(b => !contrastIds.has(b.id))
      .slice(0, needed)
      .map((book, idx) => ({
        ...book,
        placement: 11 + contrastBooks.length + idx,
        isContrast: true
      }));
    contrastBooks.push(...filler);
  }

  return [...topBooks, ...contrastBooks];
};