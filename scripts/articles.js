document.addEventListener('DOMContentLoaded', function() {
    let articles = [];
    let translations = {};
    let currentPage = 1;
    const articlesPerPage = 6;
    let selectedCategory = "all";

    Promise.all([
        fetch('articles-data.json').then(res => res.json()),
        fetch('translations-articles.json').then(res => res.json())
    ]).then(([articlesData, translationsData]) => {
        articles = articlesData;
        translations = translationsData;
        const savedLang = localStorage.getItem('preferredLang') || 'en';
        switchLanguage(savedLang);
        setupFilters(savedLang);
        renderArticles(savedLang);
    });

    function renderArticles(lang) {
        const container = document.getElementById('articlesContainer');
        container.innerHTML = '';
        const filteredArticles = selectedCategory === "all" ? articles : articles.filter(a => a.category === selectedCategory);
        const start = (currentPage - 1) * articlesPerPage;
        const paginatedArticles = filteredArticles.slice(start, start + articlesPerPage);
    
        paginatedArticles.forEach(article => {
            container.innerHTML += `
                <div class="list-article mb-4 p-3 shadow-sm">
                    <h4>${article.title}</h4>
                    <p>${article.description}</p>
                    <a href="${article.link}" class="btn btn-primary">${translations[lang].readMore}</a>
                </div>
            `;
        });
    
        setupPagination(filteredArticles.length);
    }

    function setupFilters(lang) {
        const filters = document.getElementById('categoryFilters');
        filters.innerHTML = `
            <button class="btn btn-primary m-1" onclick="filterArticles('all')">${translations[lang].categories.all}</button>
            <button class="btn btn-primary m-1" onclick="filterArticles('Marketing')">${translations[lang].categories.marketing}</button>
            <button class="btn btn-primary m-1" onclick="filterArticles('Growth Hacking')">${translations[lang].categories.growth}</button>
            <button class="btn btn-primary m-1" onclick="filterArticles('Finance')">${translations[lang].categories.finance}</button>
        `;
    }

    function setupPagination(totalArticles) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        const pageCount = Math.ceil(totalArticles / articlesPerPage);
        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = 'btn' + (i === currentPage ? ' active' : '');
            button.onclick = function() {
                currentPage = i;
                renderArticles(localStorage.getItem('preferredLang') || 'en');
            };
            pagination.appendChild(button);
        }
    }

    window.filterArticles = function(category) {
        selectedCategory = category;
        currentPage = 1;
        const lang = localStorage.getItem('preferredLang') || 'en';
        renderArticles(lang);
    };

    function switchLanguage(lang) {
        const trans = translations[lang] || translations['en'];
        document.querySelector('[data-lang-key="articlesHeroTitle"]').textContent = trans.articlesHeroTitle;
        document.querySelector('[data-lang-key="articlesHeroSubtitle"]').textContent = trans.articlesHeroSubtitle;
        document.querySelector('[data-lang-key="footerTitle"]').textContent = trans.footerTitle;
        document.querySelector('[data-lang-key="footerText"]').textContent = trans.footerText;
        document.querySelector('[data-lang-key="subscribe"]').textContent = trans.subscribe;
        document.querySelector('[data-lang-key="placeholderEmail"]').setAttribute('placeholder', trans.placeholderEmail);
        setupFilters(lang);
        renderArticles(lang);
    }

    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            localStorage.setItem('preferredLang', lang);
            switchLanguage(lang);
        });
    });
});