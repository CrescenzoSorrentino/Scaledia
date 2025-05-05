
// scaledia.js - versione stabile ricostruita

document.addEventListener("DOMContentLoaded", () => {
  console.log("Scaledia.js inizializzato");
  initLanguageSwitcher();
  initCategoryFilters();
  initArticleList();
  initArticlePage();
});

// === 1. Gestione traduzioni globali (hero, footer, navbar, ecc.)
function initLanguageSwitcher() {
  const defaultLang = 'en';
  const translationFile = 'articles-data/translations.json';
  let translationsData = {};

  fetch(translationFile)
    .then(res => res.json())
    .then(data => {
      translationsData = data;
      const savedLang = localStorage.getItem('preferredLang') || defaultLang;
      applyTranslations(savedLang, translationsData);
    })
    .catch(error => console.error("Errore durante il caricamento delle traduzioni:", error));

  document.querySelectorAll(".language-option").forEach(option => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedLang = e.target.dataset.lang;
      localStorage.setItem("preferredLang", selectedLang);
      applyTranslations(selectedLang, translationsData);
    });
  });
}

function applyTranslations(lang, data) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-lang-key]").forEach(el => {
    const key = el.getAttribute("data-lang-key");
    if (data[lang] && data[lang][key]) {
      if (["INPUT", "TEXTAREA"].includes(el.tagName)) {
        el.placeholder = data[lang][key];
      } else if (el.getAttribute("data-lang-html") === "true") {
        el.innerHTML = data[lang][key];
      } else {
        el.textContent = data[lang][key];
      }
    }
  });
}

// === 2. Filtri categoria (solo su articles.html)
function initCategoryFilters() {
  const filterButtons = document.querySelectorAll('#categoryFilter button');
  const articleCards = document.querySelectorAll('.article-card');
  if (!filterButtons.length || !articleCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');

      articleCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        card.style.display = (category === 'all' || cardCategory === category) ? 'block' : 'none';
      });

      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

// === 3. Lista articoli dinamica con traduzioni
function initArticleList() {
  const container = document.getElementById("articlesContainer");
  const pagination = document.getElementById("pagination");
  if (!container || !pagination) return;

  const articlesPerPage = 6;
  let allArticles = [];
  let currentPage = 1;
  let currentCategory = "all";
  const lang = localStorage.getItem("preferredLang") || "en";

  fetch("articles-data/articles-list.json")
    .then(res => res.json())
    .then(data => {
      allArticles = data;
      renderArticles();
      renderPagination();
    })
    .catch(err => console.error("Errore caricamento articoli:", err));

  function renderArticles() {
    container.innerHTML = "";
    const filtered = allArticles.filter(article =>
      currentCategory === "all" || article.category === currentCategory
    );
    const start = (currentPage - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    const articlesToShow = filtered.slice(start, end);

    articlesToShow.forEach(article => {
      const translation = (article.translations || {})[lang] || (article.translations || {}).en || {};
      const col = document.createElement("div");
      col.className = "col article-card";
      col.setAttribute("data-category", article.category);
      col.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${translation.title || ""}</h5>
            <p class="card-text small">${translation.description || ""}</p>
            <a href="${article.link}" class="btn btn-outline-primary btn-sm">Read More</a>
          </div>
        </div>`;
      container.appendChild(col);
    });
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const filtered = allArticles.filter(article =>
      currentCategory === "all" || article.category === currentCategory
    );
    const totalPages = Math.ceil(filtered.length / articlesPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = "page-item" + (i === currentPage ? " active" : "");
      const btn = document.createElement("button");
      btn.className = "page-link";
      btn.textContent = i;
      btn.addEventListener("click", () => {
        currentPage = i;
        renderArticles();
        renderPagination();
      });
      li.appendChild(btn);
      pagination.appendChild(li);
    }
  }

  const filterButtons = document.querySelectorAll('#categoryFilter button');
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      currentCategory = button.getAttribute("data-category");
      currentPage = 1;
      renderArticles();
      renderPagination();
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

// === 4. Pagina singolo articolo: contenuto + traduzioni + correlati
function initArticlePage() {
  const mainEl = document.querySelector("main");
  if (!mainEl) return;

  const translationFile = mainEl.dataset.json;
  const category = mainEl.dataset.category || "";
  const currentTitle = mainEl.dataset.title || "";
  const defaultLang = "en";

  fetch("../articles-data/translations.json")
    .then(res => res.json())
    .then(globalData => {
      fetch(translationFile)
        .then(res => res.json())
        .then(articleData => {
          const savedLang = localStorage.getItem("preferredLang") || defaultLang;
          const combined = {
            [savedLang]: {
              ...globalData[savedLang],
              ...articleData[savedLang]
            }
          };
          applyArticleLanguage(savedLang, combined);
        });
    })
    .catch(error => console.error("Errore caricamento traduzioni articolo:", error));

  function applyArticleLanguage(lang, translationsData) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang-key]").forEach(el => {
      const key = el.getAttribute("data-lang-key");
      if (translationsData[lang] && translationsData[lang][key]) {
        if (["INPUT", "TEXTAREA"].includes(el.tagName)) {
          el.placeholder = translationsData[lang][key];
        } else if (el.getAttribute("data-lang-html") === "true") {
          el.innerHTML = translationsData[lang][key];
        } else {
          el.textContent = translationsData[lang][key];
        }
      }
    });

    const articleContainer = document.getElementById("article-content");
    if (articleContainer && translationsData[lang].content) {
      articleContainer.innerHTML = translationsData[lang].content;
    }
  }

  // Articoli correlati
  fetch("../articles-data/articles.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("recommended-articles");
      if (!container) return;

      const filtered = data.filter(article =>
        article.category === category && article.title !== currentTitle
      );

      filtered.slice(0, 3).forEach(article => {
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">
                <a href="${article.link}" class="text-decoration-none">${article.title}</a>
              </h5>
            </div>
          </div>`;
        container.appendChild(col);
      });
    })
    .catch(error => console.error("Errore articoli correlati:", error));
}
