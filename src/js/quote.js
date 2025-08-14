const quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" }
];

export const initQuotes = (containerSelector) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const quoteText = container.querySelector('.quote-text');
  const quoteAuthor = container.querySelector('.quote-author');
  
  let currentIndex = 0;

  const renderQuote = () => {
    const quote = quotes[currentIndex];
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = `— ${quote.author}`;
    currentIndex = (currentIndex + 1) % quotes.length;
  };

  renderQuote();
  setInterval(renderQuote, 8000);
};
