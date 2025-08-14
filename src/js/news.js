// =================== news.js ===================

export class News {
    constructor(topic = 'news') {
        this.topic = topic;
        this.cloudBasePath = '/cloud/';
        this.currentYear = null;
        this.currentMonth = null;
        this.currentPage = 1;
        this.totalArticles = 0;
        this.isListView = true; // Track if we are in list view
        this.articles = [];
    }

    // Initialize the News class by loading the news data
    async initialize() {
        await this.loadNewsData();
        this.renderNewsList(this.articles.slice(0, 10)); // Show only 10 articles initially
    }

    // Utility function to fetch JSON data and handle errors
    async fetchJson(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${url}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            this.showErrorMessage("Failed to load data. Please try again later.");
        }
    }

    // Fetch and load the list of articles from the latest year and month
    async loadNewsData() {
        try {
            // Fetch metadata (2025 -> [august])
            const newsMetaData = await this.fetchJson(`${this.cloudBasePath}${this.topic}/news.json`);
            if (!newsMetaData || !Object.keys(newsMetaData).length) {
                throw new Error('No metadata found.');
            }

            // Get latest year and month
            const latestYear = Object.keys(newsMetaData)[0];
            const latestMonth = newsMetaData[latestYear][0];
            this.currentYear = latestYear;
            this.currentMonth = latestMonth;

            // Fetch index.json for the latest year/month
            const indexData = await this.fetchJson(`${this.cloudBasePath}${this.topic}/${latestYear}/${latestMonth}/index.json`);
            if (!indexData || !indexData.articleList) {
                throw new Error('No article list found in index.json.');
            }

            // Update total articles and store the articles
            this.totalArticles = indexData.articleList.length;
            this.articles = indexData.articleList;

        } catch (error) {
            console.error("Error loading news data:", error);
            this.showErrorMessage("Failed to load news data. Please try again later.");
        }
    }


    // Display error messages to users
    showErrorMessage(message) {
        const errorContainer = document.createElement('div');
        errorContainer.classList.add('error-message');
        errorContainer.textContent = message;
        document.body.appendChild(errorContainer);
    }

    // Render the list of articles dynamically
    renderNewsList(articles) {
        const newsListContainer = document.getElementById('newsList');
        if (!newsListContainer) {
            return; // If the container doesn't exist, don't continue
        }

        newsListContainer.innerHTML = ''; // Clear current list

        articles.forEach(article => {
            const articleElement = this.createArticleElement(article);
            newsListContainer.appendChild(articleElement);
        });
    }


    createArticleElement(article) {
        const articleElement = document.createElement('div');
        articleElement.classList.add('news-article');

        // Article Title
        const articleTitle = document.createElement('h3');
        articleTitle.textContent = article.title;

        // Article Summary
        const articleSummary = document.createElement('p');
        articleSummary.textContent = article.summary;

        // Author Name (as a clickable link)
        const articleAuthor = document.createElement('p');
        articleAuthor.classList.add('article-author');

        // Create the author link
        const authorLink = document.createElement('a');
        authorLink.href = `https://cyberaxar.github.io/home/about/about.html`;  // Link to the author's page
        authorLink.textContent = `By ${article.author}`;  // Author's name, can be dynamically set
        articleAuthor.appendChild(authorLink);  // Append the link to the author paragraph

        // Article Cover (Image or Video)
        const articleCover = document.createElement('div');
        articleCover.classList.add('article-cover');

        if (article.cover && article.cover.type === 'image') {
            const img = document.createElement('img');
            img.src = article.cover.image.src;
            img.alt = article.cover.image.alt;
            articleCover.appendChild(img);
        } else if (article.cover && article.cover.type === 'video') {
            const video = document.createElement('video');
            video.src = article.cover.video.src;
            video.controls = true;
            articleCover.appendChild(video);
        }

        // Read More Button
        const readMoreButton = document.createElement('button');
        readMoreButton.textContent = 'More';
        readMoreButton.classList.add('read-more-btn');
        readMoreButton.onclick = () => this.loadFullArticle(article);

        // Append all elements
        articleElement.appendChild(articleCover);
        articleElement.appendChild(articleTitle);
        articleElement.appendChild(articleSummary);
        articleElement.appendChild(articleAuthor);  // Append the article author with the link
        articleElement.appendChild(readMoreButton);

        return articleElement;
    }




    // Load full article content when "Read More" is clicked
    async loadFullArticle(article) {
        this.isListView = false; // Set to false, because we are showing the full article
        const newsListContainer = document.getElementById('newsList');
        const backButton = document.getElementById('backButton');
        const nextButton = document.getElementById('nextButton');
        const pageInfo = document.getElementById('pageInfo');

        // Hide the news list and show full article view
        newsListContainer.innerHTML = '';

        try {
            // Fetch the full article content
            const articleContent = await fetch(article.path);
            const articleText = await articleContent.text();

            // Create a container for the full article
            const fullArticle = document.createElement('div');
            fullArticle.classList.add('full-article');

            // Create the "Back" button inside the article
            const backButtonInArticle = document.createElement('button');
            backButtonInArticle.textContent = 'Back to List';
            backButtonInArticle.classList.add('read-more-btn');
            backButtonInArticle.onclick = () => this.goBackToList(); // Go back to the list

            // Add the article title and content
            fullArticle.innerHTML = `<h2>${article.title}</h2><p>${articleText}</p>`;

            // Append the "Back" button inside the article content
            fullArticle.appendChild(backButtonInArticle);
            newsListContainer.appendChild(fullArticle);

        } catch (error) {
            console.error('Error loading full article:', error);
            this.showErrorMessage('Failed to load the article. Please try again later.');
        }

        // Hide "Next" button and show "Back to List" button inside the article
        backButton.style.display = 'none'; // Hide the outside "Back" button
        nextButton.style.display = 'none'; // Hide the "Next" button
        pageInfo.textContent = `Viewing: ${article.title}`; // Show page info
    }


    // Handle the "Back" button to return to the news list
    goBackToList() {
        this.isListView = true; // Set to true, because we are going back to list view
        const backButton = document.getElementById('backButton');
        const nextButton = document.getElementById('nextButton');
        const pageInfo = document.getElementById('pageInfo');
        const newsListContainer = document.getElementById('newsList');

        // Re-render the news list (this will bring back the list of articles)
        this.renderNewsList(this.articles.slice(0, 10));

        // Show the "Back" button and "Next" button for pagination
        backButton.style.display = 'none'; // "Back" button outside remains hidden
        nextButton.style.display = 'block'; // Show the "Next" button
        pageInfo.textContent = ''; // Clear page info
    }


    // Handle the "Next" button (e.g., for pagination)
    loadNextPage() {
        // Handle loading the next page here
        // For example, load articles 10-20, etc.
    }

    // Attach event listeners to buttons
    attachEventListeners() {
        const backButton = document.getElementById('backButton');
        const nextButton = document.getElementById('nextButton');

        // Check if the elements exist and attach event listeners only if present
        if (backButton) {
            backButton.addEventListener('click', () => this.goBackToList());
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => this.loadNextPage());
        }
    }
}
