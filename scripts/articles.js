// Lista articoli Scaledia
const articlesData = [
  {
    title: "Digital Marketing Trends 2025",
    description: "Explore the upcoming trends in digital marketing that will dominate in 2025.",
    category: "Marketing",
    link: "#"
  },
  {
    title: "Growth Hacking Techniques for Startups",
    description: "Learn growth hacking methods to rapidly scale your startup.",
    category: "Growth Hacking",
    link: "#"
  },
  {
    title: "Managing Personal Finances Effectively",
    description: "Simple strategies to take control of your financial future.",
    category: "Finance",
    link: "#"
  }
];

// Funzione per creare ogni articolo
function createArticleElement(article) {
  const articleElement = document.createElement('div');
  articleElement.className = 'list-group-item mb-4 p-4 bg-white rounded shadow-sm';
  articleElement.setAttribute('data-category', article.category); // <-- questa riga è importantissima!

  const title = document.createElement('h3');
  title.className = 'h5 mb-2';
  title.textContent = article.title;

  const description = document.createElement('p');
  description.className = 'mb-3';
  description.textContent = article.description;

  const readMoreBtn = document.createElement('a');
  readMoreBtn.className = 'btn btn-primary';
  readMoreBtn.href = article.link;
  readMoreBtn.textContent = 'Read More';

  articleElement.appendChild(title);
  articleElement.appendChild(description);
  articleElement.appendChild(readMoreBtn);

  return articleElement;
}

// Funzione per mostrare tutti gli articoli
function renderArticles(filter = "All") {
  const container = document.getElementById('articlesContainer');
  container.innerHTML = '';

  articlesData.forEach(article => {
    if (filter === "All" || article.category === filter) {
      const articleElement = createArticleElement(article);
      container.appendChild(articleElement);
    }
  });
}

// Funzione per attivare i filtri
function setupFilters() {
  const buttons = document.querySelectorAll('[data-filter]');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      renderArticles(filter);
    });
  });
}

// Lanciamo tutto quando la pagina è pronta
document.addEventListener('DOMContentLoaded', () => {
  renderArticles();
  setupFilters();
});