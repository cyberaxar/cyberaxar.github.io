const slidesData = [
  {
    title: "Passion for Technology",
    content: "My love for computers began in childhood, driven by curiosity about how information is stored, commands are followed, and programs run inside a computer.",
    time: 12, 
  },
  {
    title: "Self-Taught Journey",
    content: "Without formal college education, I taught myself programming through countless hours of online tutorials, articles, and open source projects, fueled by determination and curiosity.",
    time: 13, 
  },
  {
    title: "C++ and Deep Understanding",
    content: "C++ became my favorite language because it’s powerful and close to hardware, helping me grasp memory management, data structures, algorithms, and system-level programming.",
    time: 13, 
  },
  {
    title: "Exploring How Things Work",
    content: "I strive to understand the ‘why’ behind technology — from compilers transforming code to machine instructions, to how operating systems manage processes and render graphics.",
    time: 14, 
  },
  {
    title: "The Internet as My Teacher",
    content: "The internet is my greatest resource — a vast free library of knowledge. I respect it deeply and share my learnings to help others navigate their own self-learning paths.",
    time: 13, 
  },
  {
    title: "Lifelong Learning",
    content: "Technology constantly evolves. I embrace patience and passion to keep learning every day, proving that skill comes from persistence, not just formal degrees.",
    time: 11, 
  }
];

export const initSlideshow = (containerSelector) => {
  const container = document.querySelector(containerSelector);
  if (!container || !slidesData.length) return;

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
    const slide = slidesData[index];
    slideTitle.textContent = slide.title;
    slideBody.textContent = slide.content;
    slidePage.textContent = `Page ${index + 1} of ${slidesData.length}`;

    if (slideTimeoutId) clearTimeout(slideTimeoutId);

    if (isSlideshowStarted) {
      const timeSeconds = slide.time || 10;
      slideTimeoutId = setTimeout(() => {
        currentIndex = (currentIndex === slidesData.length - 1) ? 0 : currentIndex + 1;
        renderSlide(currentIndex);
      }, timeSeconds * 1000);
    }
  };

  const goPrev = () => {
    currentIndex = (currentIndex === 0) ? slidesData.length - 1 : currentIndex - 1;
    renderSlide(currentIndex);
  };

  const goNext = () => {
    currentIndex = (currentIndex === slidesData.length - 1) ? 0 : currentIndex + 1;
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

  btnPrev.addEventListener('click', goPrev);
  btnNext.addEventListener('click', goNext);
  btnTogglePlay.addEventListener('click', toggleSlideshow);

  renderSlide(currentIndex);
};
