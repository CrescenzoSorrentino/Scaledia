document.addEventListener("DOMContentLoaded", function () {
  const titleEl = document.getElementById("article-title");
  const subtitleEl = document.getElementById("article-subtitle");
  const contentEl = document.getElementById("article-content");

  // Imposta lingua preferita in base al browser, default "en"
  const userLang = navigator.language.slice(0, 2);
  const supportedLangs = ["en", "it", "es", "zh"];
  const lang = supportedLangs.includes(userLang) ? userLang : "en";

  fetch("articles-data/credit-cards.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch credit-cards.json");
      }
      return response.json();
    })
    .then(data => {
      const article = data[lang];
      if (!article) {
        throw new Error(`No article found for language: ${lang}`);
      }

      titleEl.textContent = article.title;
      subtitleEl.textContent = article.subtitle;
      contentEl.innerHTML = article.content;
    })
    .catch(error => {
      console.error("Error loading article:", error);
      titleEl.textContent = "Oops!";
      subtitleEl.textContent = "";
      contentEl.innerHTML = "<p>Sorry, the article could not be loaded. Please try again later.</p>";
    });
});

  // === Scroll Back to Top ===
  const backTopBtn = document.querySelector('a[href="#top"]');
  if (backTopBtn) {
    backTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === Articoli correlati (facoltativo) ===
  const mainEl = document.querySelector("main");
  if (!mainEl) return;

  const category = mainEl.dataset.category;
  const title = mainEl.dataset.title;

  fetch("../../articles.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("recommended-articles");
      const filtered = data.filter(article => article.category === category && article.title !== title);
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
    });