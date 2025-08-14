import { initQuotes } from './quote.js';
import { initSlideshow } from './slide.js';
import { News } from './news.js';

class App {
  constructor() {
    this.navElement = document.querySelector(".nav");
    this.isNavOpen = false;
    this.printCopyright();

    this.initSlideshow('.slideshow');
    this.initGreetingInfo();
    this.initQuotes('.quote');
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

  initSlideshow = (containerSelector) => {
    initSlideshow(containerSelector); // Using the initSlideshow from slide.js
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
    initQuotes(containerSelector); // Using the initQuotes from quote.js
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
