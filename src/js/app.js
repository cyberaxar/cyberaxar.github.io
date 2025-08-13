import { slidesData } from './slides.js';

class App {
  constructor() {
    this.navElement = document.querySelector(".nav");
    this.isNavOpen = false;
    this.printCopyright();

    this.initSlideshow('.slideshow', slidesData);
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
    let isSlideshowStarted = false; // slideshow paused by default

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

    btnPrev.addEventListener('click', () => {
      goPrev();
    });

    btnNext.addEventListener('click', () => {
      goNext();
    });

    btnTogglePlay.addEventListener('click', toggleSlideshow);

    // Swipe support
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
      const threshold = 50; // minimum px swipe
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    };

    // Start with first slide but slideshow paused
    renderSlide(currentIndex);
  };
}

const app = new App();
window.app = app;
export default app;
