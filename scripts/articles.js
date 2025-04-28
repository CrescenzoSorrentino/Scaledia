document.addEventListener('DOMContentLoaded', function() {
    // Lista articoli Scaledia
const articlesData = [
    {
      title: "Digital Marketing Trends 2025",
      description: "Explore the upcoming trends in digital marketing that will dominate in 2025.",
      link: "#"
    },
    {
      title: "Growth Hacking Techniques for Startups",
      description: "Learn growth hacking methods to rapidly scale your startup.",
      link: "#"
    },
    {
      title: "Managing Personal Finances Effectively",
      description: "Simple strategies to take control of your financial future.",
      link: "#"
    }
  ];
  
  // Funzione per creare ogni articolo
  function createArticleElement(article) {
    const articleElement = document.createElement('div');
    articleElement.className = 'list-group-item mb-4 p-4 bg-white rounded shadow-sm';
  
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
  function renderArticles() {
    const container = document.getElementById('articlesContainer');
    container.innerHTML = '';
  
    articlesData.forEach(article => {
      const articleElement = createArticleElement(article);
      container.appendChild(articleElement);
    });
  }
  
  // Lanciamo il caricamento articoli appena la pagina è pronta
  document.addEventListener('DOMContentLoaded', renderArticles);