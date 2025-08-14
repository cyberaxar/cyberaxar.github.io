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

/**
 * @function initSlideshow
 * @description Initializes a slideshow with automatic playback, manual navigation, and swipe support.
 * @param {string} containerSelector - CSS selector for the slideshow container element.
 */
export const initSlideshow = (containerSelector) => {
  const container = document.querySelector(containerSelector);

  // @ Check if the container exists and we have slides to show
  if (!container || !Array.isArray(slidesData) || slidesData.length === 0) return;

  // @ Setup slideshow HTML layout inside the container
  container.innerHTML = `
    <section class="slide-content">
      <h2 class="slide-title"></h2>
      <div class="slide-body"></div>
    </section>
    <section class="slide-controls">
      <button class="slide-btn left" aria-label="Previous slide">&lt;</button>
      <button class="slide-btn toggle-play" aria-label="Toggle slideshow">▶️</button>
      <button class="slide-btn right" aria-label="Next slide">&gt;</button>
    </section>
    <section class="slide-footer">
      <p class="slide-page"></p>
    </section>
  `;

  // @ Safely get all required child elements
  const slideTitle = container.querySelector('.slide-title');
  const slideBody = container.querySelector('.slide-body');
  const slidePage = container.querySelector('.slide-page');
  const btnPrev = container.querySelector('.slide-btn.left');
  const btnNext = container.querySelector('.slide-btn.right');
  const btnTogglePlay = container.querySelector('.slide-btn.toggle-play');

  // @ If any required child element is missing, exit safely
  if (!slideTitle || !slideBody || !slidePage || !btnPrev || !btnNext || !btnTogglePlay) return;

  let currentIndex = 0;           // @ Tracks current slide index
  let slideTimeoutId = null;      // @ Stores the timeout ID for auto slide
  let isSlideshowStarted = false; // @ Tracks whether the slideshow is playing

  /**
   * @function renderSlide
   * @description Updates the DOM with the current slide's title, content, and page number.
   * @param {number} index - Index of the slide to display
   */
  const renderSlide = (index) => {
    const slide = slidesData[index];

    // @ Update the title and content using safe access
    slideTitle.textContent = slide?.title ?? 'Untitled';
    slideBody.textContent = slide?.content ?? '';
    slidePage.textContent = `Page ${index + 1} of ${slidesData.length}`;

    // @ Clear any existing timer before setting a new one
    clearTimeout(slideTimeoutId);

    // @ If slideshow is active, set a new timeout based on slide time
    if (isSlideshowStarted) {
      const timeSeconds = Math.max(Number(slide?.time ?? 10), 1); // @ Ensure at least 1s
      slideTimeoutId = setTimeout(() => {
        goNext();
      }, timeSeconds * 1000);
    }
  };

  /**
   * @function goPrev
   * @description Goes to the previous slide (circular)
   */
  const goPrev = () => {
    currentIndex = (currentIndex - 1 + slidesData.length) % slidesData.length;
    renderSlide(currentIndex);
  };

  /**
   * @function goNext
   * @description Goes to the next slide (circular)
   */
  const goNext = () => {
    currentIndex = (currentIndex + 1) % slidesData.length;
    renderSlide(currentIndex);
  };

  /**
   * @function toggleSlideshow
   * @description Starts or pauses the automatic slideshow
   */
  const toggleSlideshow = () => {
    isSlideshowStarted = !isSlideshowStarted;

    // @ Update play/pause button symbol
    btnTogglePlay.textContent = isSlideshowStarted ? '⏸' : '▶️';

    // @ Start or stop the slideshow accordingly
    if (isSlideshowStarted) {
      renderSlide(currentIndex); // @ This also sets the timeout
    } else {
      clearTimeout(slideTimeoutId);
    }
  };

  // @ Attach click events to navigation buttons
  btnPrev.addEventListener('click', () => {
    clearTimeout(slideTimeoutId); // @ Clear auto-cycle on manual change
    goPrev();
  });

  btnNext.addEventListener('click', () => {
    clearTimeout(slideTimeoutId);
    goNext();
  });

  btnTogglePlay.addEventListener('click', toggleSlideshow);

  // -------------------------------
  // TOUCH / SWIPE SUPPORT SECTION
  // -------------------------------
  let touchStartX = 0;
  let touchEndX = 0;

  /**
   * @function handleSwipe
   * @description Detects swipe direction and navigates slides
   */
  const handleSwipe = () => {
    const deltaX = touchEndX - touchStartX;

    // @ Ignore small swipes
    if (Math.abs(deltaX) < 50) return;

    // @ Clear timer since user manually interacted
    clearTimeout(slideTimeoutId);

    if (deltaX > 0) {
      // @ Swiped right -> next
      goNext();
    } else {
      // @ Swiped left -> previous
      goPrev();
    }
  };

  // @ Attach touch event listeners to the container
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches?.[0]?.screenX ?? 0;
  });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches?.[0]?.screenX ?? 0;
    handleSwipe();
  });

  // @ Initially render the first slide
  renderSlide(currentIndex);
};
