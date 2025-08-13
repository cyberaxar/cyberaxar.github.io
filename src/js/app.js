import { slidesData, quotesData } from './slides.js';

class App {
  constructor() {
    this.navElement = document.querySelector(".nav");
    this.isNavOpen = false;
    this.printCopyright();

    this.initSlideshow('.slideshow', slidesData);
    this.initGreetingInfo();
    this.initQuotes('.quote', quotesData);
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
}

// =========

class AxarNews {
  #isMenuOpen = false;
  #currentPage = 1;
  #itemsPerPage = 3;
  #posts = [];
  #totalPosts = 0;
  #activeYear = null;
  #activeMonth = null;
  #activeTopic = "news";
  #availabilityMap = {};
  #allowedTopics = Object.freeze(["news", "blog"]);

  // DOM Elements
  #postsContainer = null;
  #fullPostContainer = null;
  #prevBtn = null;
  #nextBtn = null;
  #pageIndicator = null;
  #backBtn = null;

  constructor(config = {}) {
    // Set defaults or custom configuration
    this.#itemsPerPage = config.itemsPerPage || this.#itemsPerPage;

    // DOM elements initialization
    this.#postsContainer = document.getElementById("posts-container");
    this.#fullPostContainer = document.getElementById("fullBlogContainer");
    this.#prevBtn = document.getElementById("prev");
    this.#nextBtn = document.getElementById("next");
    this.#pageIndicator = document.getElementById("page-info");
    this.#backBtn = document.getElementById("back-button");

    // Check for missing DOM elements
    this.#checkDomElements();

    // If all required DOM elements are present, setup the necessary events
    if (this.#postsContainer && this.#fullPostContainer && this.#prevBtn && this.#nextBtn && this.#backBtn) {
      this.#setupPaginationEvents();
      this.#setupAccessibility();
    } else {
      console.warn("One or more required DOM elements are missing.");
    }
  }

  // Check for missing DOM elements and log
  #checkDomElements() {
    if (!this.#postsContainer) {
      console.error("Missing DOM element: #posts-container");
    }
    if (!this.#fullPostContainer) {
      console.error("Missing DOM element: #fullBlogContainer");
    }
    if (!this.#prevBtn) {
      console.error("Missing DOM element: #prev");
    }
    if (!this.#nextBtn) {
      console.error("Missing DOM element: #next");
    }
    if (!this.#backBtn) {
      console.error("Missing DOM element: #back-button");
    }
  }

  // Fetch availability map data
  async #fetchAvailabilityMap() {
    try {
      const res = await fetch(`/cloud/${this.#activeTopic}.json?v=${Date.now()}`);
      if (!res.ok) throw new Error("Failed to fetch availability map");
      const data = await res.json();
      this.#availabilityMap = data;
      return data;
    } catch (e) {
      console.error("Error fetching availability map:", e);
      throw e;
    }
  }

  // Find latest year and month data
  async #findLatestYearMonth() {
    const monthOrder = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const years = Object.keys(this.#availabilityMap).sort((a, b) => b - a);

    for (const year of years) {
      const months = this.#availabilityMap[year];
      months.sort((a, b) => monthOrder.indexOf(b.toLowerCase()) - monthOrder.indexOf(a.toLowerCase()));

      for (const month of months) {
        const url = `/cloud/${this.#activeTopic}/${year}/${month.toLowerCase()}/index.json?v=${Date.now()}`;
        try {
          const res = await fetch(url);
          if (res.ok) return { year, month: month.toLowerCase() };
        } catch { }
      }
    }
    throw new Error("No valid year/month data found");
  }

  // Load posts for the active topic
  async loadPosts() {
    if (!this.#postsContainer || !this.#fullPostContainer) return;

    // Show loading spinner and hide full post view
    this.#showElement(this.#postsContainer);
    this.#showLoading(this.#postsContainer);
    this.#hideElement(this.#fullPostContainer);
    this.#hideElement(this.#backBtn);

    try {
      // Fetch availability map and latest year/month data
      await this.#fetchAvailabilityMap();
      const { year, month } = await this.#findLatestYearMonth();
      this.#activeYear = year;
      this.#activeMonth = month;

      // Fetch posts list
      const url = `/cloud/${this.#activeTopic}/${year}/${month}/index.json?v=${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load posts list");

      const data = await res.json();
      console.log(data); // Debugging output

      if (!Array.isArray(data.blogList)) throw new Error("Invalid blogList data");

      this.#posts = data.blogList;
      this.#totalPosts = data.blogList.length;
      this.#currentPage = 1;
      this.#renderPosts();

      const meta = document.getElementById("page-meta");
      if (meta) meta.textContent = `Showing ${this.#activeTopic} posts from ${year}/${month}`;

    } catch (e) {
      console.error("Error loading posts:", e);
      this.#postsContainer.innerHTML = `<p style="color:red; text-align:center;">Failed to load posts. Please try again later.</p>`;
      this.#pageIndicator.textContent = "";
      this.#prevBtn.disabled = true;
      this.#nextBtn.disabled = true;
    }
  }

  // Create a post card
  createPostCard(post) {
    let media = "";
    if (post.cover) {
      if (post.cover.type === "image") {
        media = `<img src="${post.cover.image.src}" alt="${post.cover.image.alt}" loading="lazy" height="200px" />`;
      } else if (post.cover.type === "video") {
        media = `<video controls preload="metadata" poster="${post.cover.video.poster || ""}">
          <source src="${post.cover.video.src}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>`;
      }
    }

    return `
      <div class="card" tabindex="0" aria-label="Post titled ${post.title}">
        ${media}
        <h3>${post.title}</h3>
        <p>${post.summary}</p>
        <button class="read-more-button" aria-label="Read more about ${post.title}" onclick="axarnews.openPost('${post.path}')">Read More</button>
      </div>
    `;
  }

  // Render posts to the container
  #renderPosts() {
    const start = (this.#currentPage - 1) * this.#itemsPerPage;
    const end = start + this.#itemsPerPage;
    const currentPosts = this.#posts.slice(start, end);

    if (currentPosts.length === 0) {
      this.#postsContainer.innerHTML = `<p style="text-align:center; color:#666;">No posts found.</p>`;
      this.#pageIndicator.textContent = "";
      this.#prevBtn.disabled = true;
      this.#nextBtn.disabled = true;
      return;
    }

    this.#postsContainer.innerHTML = currentPosts.map(p => this.createPostCard(p)).join("");
    this.#updatePagination();
  }

  // Update pagination controls
  #updatePagination() {
    this.#prevBtn.disabled = this.#currentPage === 1;
    this.#nextBtn.disabled = this.#currentPage * this.#itemsPerPage >= this.#totalPosts;
    this.#pageIndicator.textContent = `Page ${this.#currentPage} of ${Math.ceil(this.#totalPosts / this.#itemsPerPage)}`;
  }

  // Open a full post
  async openPost(path) {
    this.#showLoading(this.#fullPostContainer);
    this.#hideElement(this.#postsContainer);
    this.#showElement(this.#fullPostContainer);
    this.#showElement(this.#backBtn);

    try {
      const res = await fetch(`${path}?v=${Date.now()}`);
      if (!res.ok) throw new Error("Failed to fetch full post");
      const content = await res.text();

      this.#fullPostContainer.innerHTML = `<article class="full-post" tabindex="0">${content}</article>`;
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (e) {
      console.error("Error loading full post:", e);
      this.#fullPostContainer.innerHTML = `<p style="color:red; padding:1rem;">Failed to load content. Please try again later.</p>`;
    }
  }

  // Go back to the posts list
  goBack() {
    this.#hideElement(this.#fullPostContainer);
    this.#showElement(this.#postsContainer);
    this.#hideElement(this.#backBtn);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Setup pagination event listeners
  #setupPaginationEvents() {
    if (!this.#prevBtn || !this.#nextBtn) return;

    this.#prevBtn.addEventListener("click", () => {
      if (this.#currentPage > 1) {
        this.#currentPage--;
        this.#renderPosts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    this.#nextBtn.addEventListener("click", () => {
      if (this.#currentPage * this.#itemsPerPage < this.#totalPosts) {
        this.#currentPage++;
        this.#renderPosts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Setup accessibility features like keyboard navigation
  #setupAccessibility() {
    if (!this.#postsContainer) return;

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.#isMenuOpen) this.toggleMenu();
    });

    this.#postsContainer.addEventListener("keydown", (e) => {
      const cards = [...this.#postsContainer.querySelectorAll(".card")];
      const idx = cards.indexOf(document.activeElement);

      if (e.key === "ArrowRight" && idx < cards.length - 1) {
        cards[idx + 1].focus();
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && idx > 0) {
        cards[idx - 1].focus();
        e.preventDefault();
      }
    });
  }

  // Show a loading state on a container
  #showLoading(container) {
    if (!container) return;
    container.innerHTML = `
      <div role="status" aria-live="polite" style="text-align:center; padding:2rem;">
        <span class="spinner" aria-hidden="true"></span>
        Loading...
      </div>
    `;
  }

  // Hide an element
  #hideElement(el) { if (el) el.style.display = "none"; }

  // Show an element
  #showElement(el) { if (el) el.style.display = "block"; }

  // Initialize the class and load posts
  async initialize() {
    await this.loadPosts();
  }
}

// Usage example:
const axarnews = new AxarNews({ itemsPerPage: 3 });

document.addEventListener("DOMContentLoaded", () => {
  window.axarnews = new AxarNews(); // Make the axarnews instance global
  axarnews.initialize();
});

document.addEventListener("DOMContentLoaded", () => {
  axarnews.initialize();
});


const app = new App();
window.app = app;
export default app;
