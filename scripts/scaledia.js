
document.addEventListener("DOMContentLoaded", () => {
  console.log("Scaledia.js inizializzato");

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
  // Forza animazione scroll-indicator
const scrollIcon = document.querySelector('.scroll-indicator i');
if (scrollIcon) {
  scrollIcon.style.animation = "bounceCustom 2s infinite";
}

});

function applyTranslations(lang, data) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-lang-key]").forEach(el => {
    const key = el.getAttribute("data-lang-key");
    const value = key.split('.').reduce((obj, part) => obj?.[part], data[lang]);
    if (!value) return;

    if (["INPUT", "TEXTAREA"].includes(el.tagName)) {
      el.placeholder = value;
    } else if (el.getAttribute("data-lang-html") === "true") {
      el.innerHTML = value;
    } else {
      el.textContent = value;
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

// Gestione sincronizzazione lingua con Iubenda
document.querySelectorAll('[data-lang]').forEach(button => {
  button.addEventListener('click', function () {
    const lang = this.getAttribute('data-lang') || 'en';
    document.documentElement.lang = lang;
    localStorage.setItem('preferredLang', lang);
    location.reload();
  });
});

const savedLang = localStorage.getItem('preferredLang');
if (savedLang) {
  document.documentElement.lang = savedLang;
}
