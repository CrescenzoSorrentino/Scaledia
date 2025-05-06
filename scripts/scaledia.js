
document.addEventListener("DOMContentLoaded", () => {
  console.log("Scaledia.js inizializzato");

  // Path dinamico per traduzioni
  const translationPath = location.pathname.includes("/articles/") ? "../articles-data/translations.json" : "articles-data/translations.json";

  fetch(translationPath)
    .then(res => res.json())
    .then(data => {
      const lang = localStorage.getItem("preferredLang") || "en";
      applyTranslations(lang, data);

      document.querySelectorAll(".language-option").forEach(option => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          const selectedLang = e.target.dataset.lang;
          localStorage.setItem("preferredLang", selectedLang);
          applyTranslations(selectedLang, data);
        });
      });
    })
    .catch(error => console.error("Errore durante il caricamento delle traduzioni:", error));

  initCategoryFilters();
  initArticleList();
});

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

// === Filtri categoria (solo su articles.html)
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

// === Lista articoli dinamica
function initArticleList() {
  const container = document.getElementById("articlesContainer");
  const pagination = document.getElementById("pagination");
  if (!container || !pagination) return;

  const articlesPerPage = 6;
  let allArticles = [];
  let currentPage = 1;
  let currentCategory = "all";

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
      const col = document.createElement("div");
      col.className = "col-12 col-md-4 mb-4 article-card";
      col.setAttribute("data-category", article.category);
      col.innerHTML = `
        <div class="card h-100 p-4 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${article.title}</h5>
            <p class="card-text small">${article.description}</p>
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
