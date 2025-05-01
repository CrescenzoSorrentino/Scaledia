// === 1. Inizializzazione ===
document.addEventListener("DOMContentLoaded", () => {
  const defaultLang = 'en';
  const translationFile = 'articles-data/translations.json';
  let translationsData = {};

  // === 2. Caricamento file di traduzione ===
  fetch(translationFile)
    .then(res => res.json())
    .then(data => {
      translationsData = data;
      const savedLang = localStorage.getItem('preferredLang') || defaultLang;
      switchLanguage(savedLang);
    })
    .catch(error => console.error("Errore durante il caricamento delle traduzioni:", error));

  // === 3. Funzione di cambio lingua ===
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

    localStorage.setItem('preferredLang', lang);
  }

  // === 4. Event listener per selezione lingua ===
  document.querySelectorAll(".language-option").forEach(option => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedLang = e.target.dataset.lang;
      switchLanguage(selectedLang);
    });
  });
});

// === 5. Filtri per categoria ===
const filterButtons = document.querySelectorAll('#categoryFilter button');
const articleCards = document.querySelectorAll('.article-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');

    articleCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');

      if (category === 'all' || cardCategory === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    // Optional: evidenzia il bottone attivo
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});