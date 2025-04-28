document.addEventListener('DOMContentLoaded', function() {
    // articles.js

const articlesData = [
    {
      id: 1,
      title: "Digital Marketing Trends 2025",
      description: "Explore the latest digital marketing strategies that will dominate in 2025.",
      category: "Marketing"
    },
    {
      id: 2,
      title: "Growth Hacking Tactics for Startups",
      description: "Learn the secret growth hacking techniques used by successful startups.",
      category: "Growth Hacking"
    },
    {
      id: 3,
      title: "Personal Finance Tips for 2025",
      description: "Top financial habits to master in 2025 for financial freedom.",
      category: "Finance"
    }
  ];
  
  function createArticleElement(article) {
    const articleElement = document.createElement('div');
    articleElement.className = 'list-group-item mb-4 p-4 rounded shadow-sm bg-white';
  
    const title = document.createElement('h3');
    title.className = 'h5 mb-2';
    title.textContent = article.title;
  
    const description = document.createElement('p');
    description.className = 'mb-3';
    description.textContent = article.description;
  
    const readMoreBtn = document.createElement('a');
    readMoreBtn.className = 'btn btn-primary';
    readMoreBtn.href = article.link;
    readMoreBtn.target = '_blank';
    readMoreBtn.textContent = 'Read More';
  
    articleElement.appendChild(title);
    articleElement.appendChild(description);
    articleElement.appendChild(readMoreBtn);
  
    return articleElement;
  }

  let currentPage = 1;
  const articlesPerPage = 5;
  let selectedCategory = "all";
  
  function renderArticles() {
    const container = document.getElementById('articlesContainer');
    container.innerHTML = "";
  
    let filteredArticles = articlesData;
    if (selectedCategory !== "all") {
      filteredArticles = articlesData.filter(article => article.category === selectedCategory);
    }
  
    const start = (currentPage - 1) * articlesPerPage;
    const paginatedArticles = filteredArticles.slice(start, start + articlesPerPage);
  
    paginatedArticles.forEach(article => {
      container.innerHTML += `
        <div class="list-article">
          <h3>${article.title}</h3>
          <p>${article.description}</p>
          <a href="#" class="btn">${translations["en"].readMore}</a>
        </div>
      `;
    });
  
    renderPagination(filteredArticles.length);
  }
  
  function renderFilters() {
    const filtersContainer = document.getElementById('categoryFilters');
    filtersContainer.innerHTML = "";
  
    const categories = ["all", ...new Set(articlesData.map(a => a.category))];
  
    categories.forEach(category => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-primary m-1";
      btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      btn.onclick = () => {
        selectedCategory = category;
        currentPage = 1;
        renderArticles();
      };
      filtersContainer.appendChild(btn);
    });
  }
  
  function renderPagination(totalArticles) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = "";
  
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
  
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = "btn";
      if (i === currentPage) btn.classList.add('active');
      btn.onclick = () => {
        currentPage = i;
        renderArticles();
      };
      paginationContainer.appendChild(btn);
    }
  }
  

  
  // Inizializzazione
  renderFilters();
  renderArticles();