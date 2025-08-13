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
        newsListContainer.innerHTML = ''; // Clear current list

        articles.forEach(article => {
            const articleElement = this.createArticleElement(article);
            newsListContainer.appendChild(articleElement);
        });
    }

    // Create the HTML for an individual article
    createArticleElement(article) {
        const articleElement = document.createElement('div');
        articleElement.classList.add('news-article');

        const articleTitle = document.createElement('h3');
        articleTitle.textContent = article.title;

        const articleSummary = document.createElement('p');
        articleSummary.textContent = article.summary;

        const readMoreButton = document.createElement('button');
        readMoreButton.textContent = 'Read More';
        readMoreButton.classList.add('read-more-btn');
        readMoreButton.onclick = () => this.loadFullArticle(article);

        articleElement.appendChild(articleTitle);
        articleElement.appendChild(articleSummary);
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
            const articleContent = await fetch(article.path);
            const articleText = await articleContent.text();

            const fullArticle = document.createElement('div');
            fullArticle.classList.add('full-article');
            fullArticle.innerHTML = `<h2>${article.title}</h2><p>${articleText}</p>`;

            newsListContainer.appendChild(fullArticle);
        } catch (error) {
            console.error('Error loading full article:', error);
            this.showErrorMessage('Failed to load the article. Please try again later.');
        }

        // Show "Back" button, hide "Next"
        backButton.style.display = 'block';
        nextButton.style.display = 'none';

        // Update page info
        pageInfo.textContent = `Viewing: ${article.title}`;
    }

    // Handle the "Back" button to return to the news list
    goBackToList() {
        this.isListView = true; // Set to true, because we are going back to list view
        const backButton = document.getElementById('backButton');
        const nextButton = document.getElementById('nextButton');
        const pageInfo = document.getElementById('pageInfo');
        const newsListContainer = document.getElementById('newsList');

        // Re-render the news list
        this.renderNewsList(this.articles.slice(0, 10));

        // Hide the "Back" button and show "Next"
        backButton.style.display = 'none';
        nextButton.style.display = 'block';
        pageInfo.textContent = ''; // Clear page info
    }

    // Handle the "Next" button (e.g., for pagination)
    loadNextPage() {
        // Handle loading the next page here
        // For example, load articles 10-20, etc.
    }

    // Attach event listeners to buttons
    attachEventListeners() {
        document.getElementById('backButton').onclick = () => this.goBackToList();
        document.getElementById('nextButton').onclick = () => this.loadNextPage();
    }
}
