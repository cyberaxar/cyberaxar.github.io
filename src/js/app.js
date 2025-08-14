// Import external modules
import { initQuotes } from './quote.js';
import { initSlideshow } from './slide.js';
import { News } from './news.js';

/**
 * @class App
 * @description The main application class to initialize UI components and navigation behavior.
 */
class App {
  /** @private @type {HTMLElement|null} Navigation container element */
  #navElement;

  /** @private @type {boolean} Track whether navigation is currently open */
  #isNavOpen = false;

  /** @constructor Initializes the app and runs startup methods */
  constructor() {
    this.#navElement = document.querySelector(".nav");

    this.#initializeApp();
  }

  /**
   * @private
   * @method #initializeApp
   * @description Runs all initialization methods on app load.
   */
  #initializeApp() {
    this.#initSlideshow('.slideshow');
    this.#initGreetingInfo();
    this.#initQuotes('.quote');
    this.#initNews();
    this.#initSwipeToCloseNav();
    this.#printCopyright();
  }

  /**
   * @public
   * @method toggleNav
   * @description Opens or closes the navigation by toggling its width.
   */
  toggleNav = () => {
    if (!this.#navElement) return;

    this.#isNavOpen = !this.#isNavOpen;
    this.#navElement.style.width = this.#isNavOpen ? "100%" : "0";
  };

  /**
   * @private
   * @method #initSwipeToCloseNav
   * @description Adds touch and mouse swipe listeners to close the nav when swiping left.
   */
  #initSwipeToCloseNav() {
    let startX = 0;
    let endX = 0;
    const threshold = 50; // Minimum swipe distance to trigger nav close
    const swipeArea = document.body;

    // Mobile (Touch)
    swipeArea.addEventListener('touchstart', (e) => {
      if (!this.#isNavOpen) return;
      startX = e.changedTouches[0].screenX;
    });

    swipeArea.addEventListener('touchend', (e) => {
      if (!this.#isNavOpen) return;
      endX = e.changedTouches[0].screenX;
      if (startX - endX > threshold) {
        this.toggleNav();
      }
    });

    // Desktop (Mouse simulation)
    swipeArea.addEventListener('mousedown', (e) => {
      if (!this.#isNavOpen) return;
      startX = e.screenX;
    });

    swipeArea.addEventListener('mouseup', (e) => {
      if (!this.#isNavOpen) return;
      endX = e.screenX;
      if (startX - endX > threshold) {
        this.toggleNav();
      }
    });
  }

  /**
   * @private
   * @method #printCopyright
   * @description Inserts the current year and site name into the footer.
   */
  #printCopyright() {
    const footer = document.querySelector(".footer");
    if (!footer) return;

    const year = new Date().getFullYear();
    footer.innerHTML = `&copy; ${year} - Cyber Axar`;
  }

  /**
   * @private
   * @method #initSlideshow
   * @param {string} selector - CSS selector for the slideshow container
   * @description Initializes the image or content slideshow
   */
  #initSlideshow(selector) {
    initSlideshow(selector);
  }

  /**
   * @private
   * @method #initGreetingInfo
   * @description Sets and updates the greeting message, date, and digital clock.
   */
  #initGreetingInfo() {
    const greetEl = document.querySelector('.greeting_message');
    const timeEl = document.querySelector('.time_message');
    const clockEl = document.querySelector('.clock');

    if (!greetEl || !timeEl || !clockEl) return;

    const updateGreeting = () => {
      const now = new Date();
      greetEl.textContent = `Good ${now.getHours() < 12 ? "morning" : "afternoon"}`;
      timeEl.textContent = `Happy ${now.toDateString()}`;
    };

    const updateClock = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString();
    };

    updateGreeting();
    updateClock();

    setInterval(updateGreeting, 60000); // Update greeting every minute
    setInterval(updateClock, 1000);     // Update clock every second
  }

  /**
   * @private
   * @method #initQuotes
   * @param {string} selector - CSS selector for the quote container
   * @description Loads and displays motivational quotes.
   */
  #initQuotes(selector) {
    initQuotes(selector);
  }

  /**
   * @private
   * @method #initNews
   * @description Initializes the news section by creating a News instance.
   */
  #initNews() {
    const news = new News();
    news.initialize();
    news.attachEventListeners();
  }
}

// Initialize app and expose to window for debugging or external calls
const app = new App();
window.app = app;

export default app;
