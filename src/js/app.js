import { slidesData } from './slides.js';

class App {
  constructor() {
    this.nav = document.querySelector(".nav");
    this.isNavOpen = false;
    this.printCopyright();

    // Initialize slideshow by passing container selector and imported data
    this.initSlideshow('.slideshow', slidesData);
  }

  toggleNav = () => {
    this.isNavOpen = !this.isNavOpen;
    this.nav.style.width = this.isNavOpen ? "100%" : "0";
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
        <button class="slide-btn right" aria-label="Next slide">&gt;</button>
      </section>
      <section class="slide-footer">
        <p class="slide-page"></p>
      </section>
    `;

    const slideTitle = container.querySelector('.slide-title');
    const slideBody = container.querySelector('.slide-body');
    const slidePage = container.querySelector('.slide-page');
    const btnLeft = container.querySelector('.slide-btn.left');
    const btnRight = container.querySelector('.slide-btn.right');

    let currentIndex = 0;

    const renderSlide = (index) => {
      const slide = slides[index];
      slideTitle.textContent = slide.title;
      slideBody.textContent = slide.content;
      slidePage.textContent = `Page ${index + 1} of ${slides.length}`;
    };

    btnLeft.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
      renderSlide(currentIndex);
    });

    btnRight.addEventListener('click', () => {
      currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
      renderSlide(currentIndex);
    });

    renderSlide(currentIndex);
  };
}

const app = new App();
window.app = app;
export default app;
