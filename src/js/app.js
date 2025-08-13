import { News } from './news.js';
import { slidesData, quotesData } from './slides.js';

class App {
  constructor() {
    this.navElement = document.querySelector(".nav");
    this.isNavOpen = false;
    this.printCopyright();

    this.initSlideshow('.slideshow', slidesData);
    this.initGreetingInfo();
    this.initQuotes('.quote', quotesData);
    this.initNews();
  }

  toggleNav = () => {
    this.isNavOpen = !this.isNavOpen;
    this.navElement.style.width = this.isNavOpen ? "100%" : "0";
  };

  printCopyright = () => {
    const footer = document.querySelector(".footer");
    if (!footer) return;
    const year = new Date().getFullYear();
    footer.innerHTML = `&copy; ${year} - Cyber Axar`;
  };

  initSlideshow = (containerSelector, slides) => {
    const container = document.querySelector(containerSelector);
    if (!container || !slides || !slides.length) return;

    container.innerHTML = `
      <section class="slide-content">
        <h2 class="slide-title"></h2>
        <div class="slide-body"></div>
      </section>
      <section class="slide-controls">
        <button class="slide-btn left" aria-label="Previous slide">&lt;</button>
        <button class="slide-btn toggle-play" aria-label="Start slideshow">▶️</button>
        <button class="slide-btn right" aria-label="Next slide">&gt;</button>
      </section>
      <section class="slide-footer">
        <p class="slide-page"></p>
      </section>
    `;

    const slideTitle = container.querySelector('.slide-title');
    const slideBody = container.querySelector('.slide-body');
    const slidePage = container.querySelector('.slide-page');
    const btnPrev = container.querySelector('.slide-btn.left');
    const btnNext = container.querySelector('.slide-btn.right');
    const btnTogglePlay = container.querySelector('.slide-btn.toggle-play');

    let currentIndex = 0;
    let slideTimeoutId = null;
    let isSlideshowStarted = false;

    const renderSlide = (index) => {
      const slide = slides[index];
      slideTitle.textContent = slide.title;
      slideBody.textContent = slide.content;
      slidePage.textContent = `Page ${index + 1} of ${slides.length}`;

      if (slideTimeoutId) clearTimeout(slideTimeoutId);

      if (isSlideshowStarted) {
        const timeSeconds = slide.time ? slide.time : 10;
        slideTimeoutId = setTimeout(() => {
          currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
          renderSlide(currentIndex);
        }, timeSeconds * 1000);
      }
    };

    const goPrev = () => {
      currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
      renderSlide(currentIndex);
    };

    const goNext = () => {
      currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
      renderSlide(currentIndex);
    };

    const toggleSlideshow = () => {
      isSlideshowStarted = !isSlideshowStarted;
      btnTogglePlay.textContent = isSlideshowStarted ? '⏸' : '▶️';
      if (isSlideshowStarted) {
        renderSlide(currentIndex);
      } else if (slideTimeoutId) {
        clearTimeout(slideTimeoutId);
      }
    };

    btnPrev.addEventListener('click', () => goPrev());
    btnNext.addEventListener('click', () => goNext());
    btnTogglePlay.addEventListener('click', toggleSlideshow);

    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    });

    const handleSwipeGesture = () => {
      const threshold = 50;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    };

    renderSlide(currentIndex);
  };

  initGreetingInfo = () => {
    const greetEl = document.querySelector('.greeting_message');
    const timeEl = document.querySelector('.time_message');
    const clockEl = document.querySelector('.clock');

    if (!greetEl || !timeEl || !clockEl) return;

    function getDateSuffix(date) {
      if (date >= 11 && date <= 13) return 'th';
      switch (date % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }

    function getFormattedDate(d) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const day = dayNames[d.getDay()];
      const date = d.getDate();
      const suffix = getDateSuffix(date);
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      return `${day}, ${date}${suffix} of ${month} ${year}`;
    }

    function getGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
    }

    const updateGreetingAndDate = () => {
      const now = new Date();
      greetEl.textContent = getGreeting();
      timeEl.textContent = `Happy ${getFormattedDate(now)}`;
    };

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const pad = n => n.toString().padStart(2, '0');
      clockEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
    };

    updateGreetingAndDate();
    updateClock();

    setInterval(updateGreetingAndDate, 60000);
    setInterval(updateClock, 1000);
  };

  initQuotes = (containerSelector, quotes) => {
    const container = document.querySelector(containerSelector);
    if (!container || !quotes || !quotes.length) return;

    container.innerHTML = `
      <blockquote class="quote-text"></blockquote>
      <cite class="quote-author"></cite>
    `;

    const quoteText = container.querySelector('.quote-text');
    const quoteAuthor = container.querySelector('.quote-author');

    let currentIndex = 0;
    const timeSeconds = 8;
    let timeoutId = null;

    const renderQuote = (index) => {
      quoteText.classList.add('fade-out');

      setTimeout(() => {
        const quote = quotes[index];
        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = quote.author ? `— ${quote.author}` : '';

        quoteText.classList.remove('fade-out');

        timeoutId = setTimeout(() => {
          currentIndex = (currentIndex + 1) % quotes.length;
          renderQuote(currentIndex);
        }, timeSeconds * 1000);
      }, 500);
    };

    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });

    container.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    const handleSwipe = () => {
      const threshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > threshold) {
        if (timeoutId) clearTimeout(timeoutId);
        if (diff > 0) {
          currentIndex = (currentIndex + 1) % quotes.length;
        } else {
          currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
        }
        renderQuote(currentIndex);
      }
    };

    renderQuote(currentIndex);
  };

  initNews = () => {
    const news = new News(); // Initialize News
    news.initialize();
    news.attachEventListeners(); // Attach event listeners for news
  };
}

const app = new App();
window.app = app;
export default app;
