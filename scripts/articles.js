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
                <div class="col-md-4">
                    <div class="card shadow-sm card-3d h-100">
                        <img src="${article.image}" class="card-img-top" alt="${article.title}" style="object-fit:cover;height:200px;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text flex-grow-1">${article.description}</p>
                            <a href="${article.link}" class="btn btn-primary mt-auto">${translations[lang].readMore}</a>
                        </div>
                    </div>
                </div>
            `;
        });

        setupPagination(lang);
    }

    function setupFilters(lang) {
        const filters = document.getElementById('categoryFilters');
        filters.innerHTML = `
            <button class="btn btn-outline-light m-1" onclick="filterArticles('all')">${translations[lang].categories.all}</button>
            <button class="btn btn-outline-light m-1" onclick="filterArticles('Marketing')">${translations[lang].categories.marketing}</button>
            <button class="btn btn-outline-light m-1" onclick="filterArticles('Growth Hacking')">${translations[lang].categories.growth}</button>
            <button class="btn btn-outline-light m-1" onclick="filterArticles('Finance')">${translations[lang].categories.finance}</button>
        `;
    }

    function setupPagination(lang) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        const filteredArticles = selectedCategory === "all" ? articles : articles.filter(a => a.category === selectedCategory);
        const pageCount = Math.ceil(filteredArticles.length / articlesPerPage);

        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = 'btn btn-outline-primary m-1' + (i === currentPage ? ' active' : '');
            button.onclick = function() {
                currentPage = i;
                renderArticles(lang);
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