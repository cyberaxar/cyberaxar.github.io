const quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", time: 3 },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson", time: 6 },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde", time: 4 },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", time: 3 },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", time: 6 }
];

/**
 * Initializes the quote swiper.
 * @param {string} containerSelector - CSS selector for the container element.
 */
export const initQuotes = (containerSelector) => {
  // Get the container element from the DOM
  const container = document.querySelector(containerSelector);
  if (!container) return; // If container not found, exit safely

  // Get the quote text and author elements inside the container
  const quoteText = container.querySelector('.quote-text');
  const quoteAuthor = container.querySelector('.quote-author');

  // If either text or author element is missing, stop execution
  if (!quoteText || !quoteAuthor) return;

  let currentIndex = 0;        // Track the current quote index
  let timeoutId = null;        // Store the timeout ID to clear when needed

  /**
   * Renders the current quote in the DOM.
   * It also sets a timeout based on the quote's `time` property.
   */
  const renderQuote = () => {
    const quote = quotes[currentIndex];

    // Update DOM elements safely
    quoteText.textContent = `"${quote?.text ?? ''}"`;
    quoteAuthor.textContent = `— ${quote?.author ?? 'Unknown'}`;

    // Clear any previous timeout before setting a new one
    clearTimeout(timeoutId);

    // Schedule the next quote based on the quote's time (in seconds)
    const displayTime = Math.max(Number(quote?.time), 1); // fallback to 1s minimum
    timeoutId = setTimeout(showNextQuote, displayTime * 1000);
  };

  /**
   * Show the next quote and wrap around if at the end.
   */
  const showNextQuote = () => {
    currentIndex = (currentIndex + 1) % quotes.length;
    renderQuote();
  };

  /**
   * Show the previous quote and wrap around if at the start.
   */
  const showPrevQuote = () => {
    currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    renderQuote();
  };

  // Touch handling variables
  let touchStartX = 0;
  let touchEndX = 0;

  /**
   * Handle the logic to detect swipe direction and switch quotes.
   */
  const handleSwipe = () => {
    const delta = touchEndX - touchStartX;

    // Ignore small swipes
    if (Math.abs(delta) < 50) return;

    // Clear any scheduled quote change
    clearTimeout(timeoutId);

    // Determine direction and show corresponding quote
    if (delta > 0) {
      // Swiped right - show previous quote
      showPrevQuote();
    } else {
      // Swiped left - show next quote
      showNextQuote();
    }
  };

  // Add touch event listeners to the container
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches?.[0]?.screenX ?? 0;
  });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches?.[0]?.screenX ?? 0;
    handleSwipe();
  });

  // Start by rendering the first quote
  renderQuote();
};
