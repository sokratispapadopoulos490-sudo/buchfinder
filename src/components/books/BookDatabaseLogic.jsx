import { books } from './BookDatabase';

export const getMatchingBooks = (profile) => {
  const { mainTopics, secondaryTopics, style, difficulty, ageGroup, readBooks = [], savedBookIds = [] } = profile;
  
  let ageFilteredBooks = books.filter(book => book.ageGroup === ageGroup);
  
  if (savedBookIds.length > 0) {
    ageFilteredBooks = ageFilteredBooks.filter(book => !savedBookIds.includes(book.id));
  }
  
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
    
    mainTopics.forEach(topic => {
      if (book.tags.includes(topic)) score += 5;
    });
    
    secondaryTopics.forEach(topic => {
      if (book.tags.includes(topic)) score += 2;
    });
    
    style.forEach(s => {
      if (book.style.includes(s)) score += 3;
    });
    
    if (book.difficulty === difficulty) score += 4;
    if (
      (difficulty === "fortgeschritten" && book.difficulty === "einsteiger") ||
      (difficulty === "einsteiger" && book.difficulty === "fortgeschritten")
    ) {
      score -= 2;
    }
    
    return { ...book, score };
  });
  
  const sorted = scoredBooks.sort((a, b) => b.score - a.score);
  
  const topBooks = sorted.slice(0, 10).map((book, idx) => ({
    ...book,
    placement: idx + 1,
    isContrast: false
  }));

  const topBookIds = new Set(topBooks.map(b => b.id));
  const remainingBooks = scoredBooks.filter(b => !topBookIds.has(b.id));
  
  const contrastBooks = remainingBooks
    .filter(book => {
      const mainTopicMatch = mainTopics.some(t => book.tags.includes(t));
      return !mainTopicMatch;
    })
    .slice(0, 3)
    .map((book, idx) => ({
      ...book,
      placement: 11 + idx,
      isContrast: true
    }));

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