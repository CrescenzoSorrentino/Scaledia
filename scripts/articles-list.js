// articles-list.js – Rendering dinamico della lista articoli con categorie, paginazione e lingua

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("articlesContainer");
  const pagination = document.getElementById("pagination");
  const filterButtons = document.querySelectorAll('#categoryFilter button');
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
        </div>
      `;

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
});

// Ricarica gli articoli nella nuova lingua al cambio lingua
document.querySelectorAll(".language-option").forEach(option => {
  option.addEventListener("click", (e) => {
    e.preventDefault();
    const newLang = e.target.dataset.lang;
    localStorage.setItem("preferredLang", newLang);
    location.reload();
  });
});
