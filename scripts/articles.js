document.addEventListener('DOMContentLoaded', function() {
    let articles = [];
    let translations = {};
    let currentPage = 1;
    const articlesPerPage = 6;

    Promise.all([
        fetch('articles-data.json').then(res => res.json()),
        fetch('translations-articles.json').then(res => res.json())
    ]).then(([articlesData, translationsData]) => {
        articles = articlesData;
        translations = translationsData.en;
        renderArticles();
        setupFilters();
        setupPagination();
    });

    function renderArticles() {
        const container = document.getElementById('articlesContainer');
        container.innerHTML = '';
        const start = (currentPage - 1) * articlesPerPage;
        const paginatedArticles = articles.slice(start, start + articlesPerPage);
        paginatedArticles.forEach(article => {
            container.innerHTML += `
                <div class="col-md-4">
                    <div class="card shadow-sm">
                        <img src="${article.image}" class="card-img-top" alt="${article.title}">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description}</p>
                            <a href="${article.link}" class="btn btn-primary">${translations.readMore}</a>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    function setupFilters() {
        const filters = document.getElementById('categoryFilters');
        filters.innerHTML = `
            <button class="btn btn-outline-primary m-1" onclick="filterArticles('all')">${translations.categories.all}</button>
            <button class="btn btn-outline-primary m-1" onclick="filterArticles('Marketing')">${translations.categories.marketing}</button>
            <button class="btn btn-outline-primary m-1" onclick="filterArticles('Growth Hacking')">${translations.categories.growth}</button>
            <button class="btn btn-outline-primary m-1" onclick="filterArticles('Finance')">${translations.categories.finance}</button>
        `;
    }

    function setupPagination() {
        document.getElementById('prevPage').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderArticles();
            }
        });
        document.getElementById('nextPage').addEventListener('click', () => {
            if (currentPage * articlesPerPage < articles.length) {
                currentPage++;
                renderArticles();
            }
        });
    }

    window.filterArticles = function(category) {
        currentPage = 1;
        if (category === 'all') {
            Promise.all([
                fetch('articles-data.json').then(res => res.json())
            ]).then(([data]) => {
                articles = data;
                renderArticles();
            });
        } else {
            Promise.all([
                fetch('articles-data.json').then(res => res.json())
            ]).then(([data]) => {
                articles = data.filter(article => article.category === category);
                renderArticles();
            });
        }
    };
});