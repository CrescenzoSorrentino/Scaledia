document.addEventListener("DOMContentLoaded", function () {
  const defaultLang = 'en';
  const translationFile = "../articles-data/credit-cards-translations.json";
  let translationsData = {};

  // === 1. Caricamento file traduzioni ===
  fetch(translationFile)
    .then(res => res.json())
    .then(data => {
      translationsData = data;
      const savedLang = localStorage.getItem('preferredLang') || defaultLang;
      switchLanguage(savedLang);
    })
    .catch(error => console.error("Errore caricamento traduzioni:", error));

  // === 2. Cambio lingua ===
  function switchLanguage(lang) {
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

    // === Caricamento contenuto dell’articolo ===
    const articleContainer = document.getElementById("article-content");
    if (articleContainer && translationsData[lang].content) {
      articleContainer.innerHTML = translationsData[lang].content;
    }

    localStorage.setItem('preferredLang', lang);
  }

  // === 3. Eventi cambio lingua ===
  document.querySelectorAll(".language-option").forEach(option => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedLang = e.target.dataset.lang;
      switchLanguage(selectedLang);
    });
  });

  // === 4. Articoli correlati dinamici ===
  const mainEl = document.querySelector("main");
  if (!mainEl) return;

  const category = mainEl.dataset.category;
  const title = mainEl.dataset.title;

  fetch("../articles-data/articles.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("recommended-articles");
      if (!container) return;

      const filtered = data.filter(article =>
        article.category === category && article.title !== title
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
          </div>
        `;

        container.appendChild(col);
      });
    })
    .catch(error => console.error("Errore articoli correlati:", error));

  // === 5. Scroll verso l'alto ===
  const backTopBtn = document.querySelector('a[href="#top"]');
  if (backTopBtn) {
    backTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});