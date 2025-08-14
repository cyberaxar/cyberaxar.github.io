import { initQuotes } from './quote.js';
import { initSlideshow } from './slide.js';
import { News } from './news.js';

class App {
  constructor() {
    this.navElement = document.querySelector(".nav");
    this.isNavOpen = false;

    this.initApp();
  }

  initApp = () => {
    this.initSlideshow('.slideshow');
    this.initGreetingInfo();
    this.initQuotes('.quote');
    this.initNews();
    this.initSwipeToCloseNav();
    this.printCopyright();
  };

  toggleNav = () => {
    this.isNavOpen = !this.isNavOpen;
    this.navElement.style.width = this.isNavOpen ? "100%" : "0";
  };

  initSwipeToCloseNav = () => {
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // px - Minimum swipe distance to trigger close
    const navArea = document.body;

    // Mobile touch swipe
    navArea.addEventListener('touchstart', (e) => {
      if (!this.isNavOpen) return;
      touchStartX = e.changedTouches[0].screenX;
    });

    navArea.addEventListener('touchend', (e) => {
      if (!this.isNavOpen) return;
      touchEndX = e.changedTouches[0].screenX;

      const swipeDistance = touchStartX - touchEndX;
      if (swipeDistance > swipeThreshold) {
        this.toggleNav();
      }
    });

    // Desktop swipe (simulated with mouse drag)
    navArea.addEventListener('mousedown', (e) => {
      if (!this.isNavOpen) return;
      touchStartX = e.screenX;
    });

    navArea.addEventListener('mouseup', (e) => {
      if (!this.isNavOpen) return;
      touchEndX = e.screenX;

      const swipeDistance = touchStartX - touchEndX;
      if (swipeDistance > swipeThreshold) {
        this.toggleNav();
      }
    });
  };

  printCopyright = () => {
    const footer = document.querySelector(".footer");
    if (!footer) return;
    const year = new Date().getFullYear();
    footer.innerHTML = `&copy; ${year} - Cyber Axar`;
  };

  initSlideshow = (containerSelector) => {
    initSlideshow(containerSelector);
  };

  initGreetingInfo = () => {
    const greetEl = document.querySelector('.greeting_message');
    const timeEl = document.querySelector('.time_message');
    const clockEl = document.querySelector('.clock');

    if (!greetEl || !timeEl || !clockEl) return;

    const updateGreetingAndDate = () => {
      const now = new Date();
      greetEl.textContent = `Good ${now.getHours() < 12 ? "morning" : "afternoon"}`;
      timeEl.textContent = `Happy ${now.toDateString()}`;
    };

    const updateClock = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString();
    };

    updateGreetingAndDate();
    updateClock();
    setInterval(updateGreetingAndDate, 60000);
    setInterval(updateClock, 1000);
  };

  initQuotes = (containerSelector) => {
    initQuotes(containerSelector);
  };

  initNews = () => {
    const news = new News();
    news.initialize();
    news.attachEventListeners();
  };
}

const app = new App();
window.app = app;
export default app;
