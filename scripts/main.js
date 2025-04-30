// ==============================
// TRADUZIONE DINAMICA
// ==============================

let translationsData = {};
const defaultLang = 'en';
const translationFile = 'translations.json';

fetch(translationFile)
  .then(response => response.json())
  .then(data => {
    translationsData = data;
    const savedLang = localStorage.getItem('preferredLang') || defaultLang;
    switchLanguage(savedLang);
  })
  .catch(error => console.error('Errore durante il caricamento delle traduzioni:', error));

function switchLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-lang-key]").forEach(el => {
    const key = el.getAttribute("data-lang-key");
    if (translationsData[lang] && translationsData[lang][key]) {
      if (el.tagName === "INPUT") {
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

document.querySelectorAll(".language-option").forEach(option => {
  option.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedLang = e.target.getAttribute("data-lang");
    switchLanguage(selectedLang);
  });
});


// ==============================
// PAGINAZIONE + FILTRI (solo su articles.html)
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('articlesContainer')) return;

  const itemsPerPage = 3;
  let currentPage = 1;
  let currentFilter = 'all';

  const listItems = document.querySelectorAll('#articlesContainer li');
  const pagination = document.getElementById('pagination');

  function updateList() {
    let visibleItems = Array.from(listItems).filter(item => {
      return currentFilter === 'all' || item.getAttribute('data-category') === currentFilter;
    });

    const totalPages = Math.ceil(visibleItems.length / itemsPerPage);

    listItems.forEach(item => item.style.display = 'none');
    visibleItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).forEach(item => {
      item.style.display = 'block';
    });

    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('li');
      pageButton.className = 'page-item' + (i === currentPage ? ' active' : '');
      pageButton.innerHTML = <button class="btn btn-outline-primary me-2">${i}</button>;
      pageButton.querySelector('button').addEventListener('click', () => {
        currentPage = i;
        updateList();
      });
      pagination.appendChild(pageButton);
    }
  }

  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      currentFilter = button.getAttribute('data-filter');
      currentPage = 1;
      updateList();
    });
  });

  updateList();
});