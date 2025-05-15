
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("preferredLang") || "en";
  document.documentElement.lang = lang;

  let translations = {};
  let articlesTranslations = {};
  let currentCategory = "all";
  let query = "";
  let visibleCount = 0;
  const LOAD_BATCH = 3;
  const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;
  const today = new Date();

  const validCategories = ["finance", "marketing", "growth", "all"];
  const hash = window.location.hash.replace("#", "");
  if (validCategories.includes(hash)) {
    currentCategory = hash;
    setTimeout(() => {
      const blogSection = document.getElementById("blog");
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  }

  const articles = [
    {
      id: "creditCards",
      published: "2025-04-30",
      title: "Credit Cards: Practical Guide to Use Them Smart",
      text: "Learn how to use credit cards smartly: tips, risks, and practical strategies.",
      category: "finance",
      url: "articles/credit-cards.html"
    },
    {
      id: "duolingo",
      published: "2025-05-05",
      title: "Duolingo: Growth Hacker in Disguise",
      text: "A growth hack masterclass: how Duolingo made language learning addictive.",
      category: "growth",
      url: "articles/duolingo-growth-hacking-case-study.html"
    },
    {
      id: "marketingGlossary",
      published: "2025-05-01",
      title: "Practical Marketing Glossary",
      text: "25 key acronyms explained with no fluff. Just what matters, clearly.",
      category: "marketing",
      url: "articles/marketing-glossary.html",
    },
    {
      id: "abTest",
      published: "2025-05-13",
      title: "A/B Test: The Secret Weapon",
      text: "Discover how A/B tests can double your conversions by changing just a few words.",
      category: "marketing",
      url: "articles/ab-test.html",
      featured: true
    },
    {
      id: "aidaMOdel",
      published: "2025-05-15",
      title: "AIDA Model: The Secret to Persuasive Copy",
      text: "Learn how to use the AIDA model to create persuasive copy that converts.",
      category: "marketing",
      url: "articles/aida-model.html",
      featured: true
    },
  ];

  fetch("articles-data/home.json")
    .then(res => res.json())
    .then(data => {
      translations = data;
      articlesTranslations = data.articlesCards || {};
      applyTranslationsHome(translations, lang);
      renderArticles(true);
      renderTopPicks();

      document.querySelectorAll(".language-option").forEach(option => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          const selectedLang = e.target.dataset.lang;
          localStorage.setItem("preferredLang", selectedLang);
          location.reload();
        });
      });

      
  // See Example buttons handler
  document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", function (e) {
      const target = this.getAttribute("href").replace("#", "");
      if (["finance", "growth", "marketing"].includes(target)) {
        e.preventDefault();
        const blog = document.getElementById("blog");
        if (blog) blog.scrollIntoView({ behavior: "smooth" });
        currentCategory = target;
        renderArticles(true);
        renderTopPicks();
        document.querySelectorAll("#filterButtons .btn").forEach(btn => {
          btn.classList.toggle("active", btn.dataset.category === currentCategory);
        });
        history.replaceState(null, "", `#${currentCategory}`);
      }
    });
  });


  document.querySelectorAll("#filterButtons .btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.category === currentCategory);
      });

      // Scroll immediato su seeExample
      document.querySelectorAll("a[href^='#growth'], a[href^='#marketing'], a[href^='#finance']").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const section = document.getElementById("blog");
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
          
          currentCategory = anchor.getAttribute("href").replace("#", "");
          
  // See Example buttons handler
  document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", function (e) {
      const target = this.getAttribute("href").replace("#", "");
      if (["finance", "growth", "marketing"].includes(target)) {
        e.preventDefault();
        const blog = document.getElementById("blog");
        if (blog) blog.scrollIntoView({ behavior: "smooth" });
        currentCategory = target;
        renderArticles(true);
        renderTopPicks();
        document.querySelectorAll("#filterButtons .btn").forEach(btn => {
          btn.classList.toggle("active", btn.dataset.category === currentCategory);
        });
        history.replaceState(null, "", `#${currentCategory}`);
      }
    });
  });


  document.querySelectorAll("#filterButtons .btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.category === currentCategory);
          });

          renderArticles(true);
          renderTopPicks();
          history.replaceState(null, "", `#${currentCategory}`);
        });
      });
    });

  function applyTranslationsHome(translations, lang) {
    const t = (key) => {
      const keys = key.split(".");
      return keys.reduce((acc, cur) => acc?.[cur], translations)?.[lang]
        || keys.reduce((acc, cur) => acc?.[cur], translations)?.en
        || "";
    };

    document.querySelectorAll("[data-lang-key]").forEach(el => {
      const key = el.getAttribute("data-lang-key");
      const value = t(key);
      if (!value) return;
      if (["INPUT", "TEXTAREA"].includes(el.tagName)) {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });

    document.getElementById("metaTitle").textContent = t("meta.title");
    document.getElementById("metaDescription").setAttribute("content", t("meta.description"));
    document.getElementById("ogTitle").setAttribute("content", t("meta.title"));
    document.getElementById("ogDescription").setAttribute("content", t("meta.description"));
    document.getElementById("twitterTitle").setAttribute("content", t("meta.title"));
    document.getElementById("twitterDescription").setAttribute("content", t("meta.description"));
    document.getElementById("ogUrl").setAttribute("content", window.location.href);
    document.getElementById("canonicalLink").setAttribute("href", window.location.href);
  }

  function translateCategory(cat) {
    return translations?.categories?.[cat]?.[lang] || cat;
  }

  function renderTopPicks() {
    const container = document.querySelector(".top-picks .row");
    if (!container || !Object.keys(articlesTranslations).length) return;
    container.innerHTML = "";

    const topPicks = articles.filter(a => a.featured).slice(0, 3);
    topPicks.forEach(article => {
      const badgeColor = article.category === "finance" ? "success" :
        article.category === "growth" ? "purple" : "info";
      const t = articlesTranslations[article.id];
      const title = t?.title?.[lang] || article.title;
      const text = t?.text?.[lang] || article.text;
      const isNew = (today - new Date(article.published)) < TEN_DAYS;
      const readTime = Math.max(2, Math.ceil((text || article.text).split(" ").length / 180));

      const el = document.createElement("div");
      el.className = "col-md-6";
      el.innerHTML = `
        <div class="p-4 border rounded shadow-sm h-100">
          <span class="badge bg-${badgeColor} text-uppercase mb-2 category-badge" style="cursor:pointer;" data-category="${article.category}">${translateCategory(article.category)}</span>
          ${isNew ? `<span class="badge bg-danger ms-2">${translations?.newBadge?.[lang] || 'NEW'}</span>` : ''}
          <h5 class="fw-bold article-title">${title}</h5>
          <div class="text-muted small mb-1">${readTime} ${translations?.readTime?.[lang] || "min read"}</div>
          <p class="mb-2 text-muted">${text}</p>
          <a class="btn btn-sm btn-outline-primary" href="${article.url}" data-lang-key="readMore">Read More</a>
        </div>
      `;
      el.querySelector(".article-title").textContent = title;
      const readMoreBtn = el.querySelector("[data-lang-key='readMore']");
      if (readMoreBtn) {
        readMoreBtn.textContent = translations?.readMore?.[lang] || 'Read More';
      }
      container.appendChild(el);
    });
  }

  function renderArticles(initial = false) {
    const searchInput = document.getElementById("searchInput");
    const articleList = document.getElementById("articleList");
    const noResults = document.getElementById("noResults");
    const loadMoreBtn = document.getElementById("loadMoreBtn");

    if (!searchInput || !articleList || !noResults || !loadMoreBtn) return;
    if (initial) visibleCount = 0;

    const filtered = articles.filter(article => {
      const matchCategory = currentCategory === "all" || article.category === currentCategory;
      const translatedTitle = articlesTranslations[article.id]?.title?.[lang] || article.title;
      const translatedText = articlesTranslations[article.id]?.text?.[lang] || article.text;
      const matchQuery = translatedTitle.toLowerCase().includes(query) || translatedText.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });

    const toRender = filtered.slice(0, visibleCount + LOAD_BATCH);
    articleList.innerHTML = "";
    if (toRender.length === 0) {
      noResults.style.display = "block";
      return;
    }
    noResults.style.display = "none";

    toRender.forEach(article => {
      const badgeColor = article.category === "finance" ? "success"
        : article.category === "growth" ? "purple"
        : "info";

      const t = articlesTranslations[article.id];
      const title = t?.title?.[lang] || article.title;
      const text = t?.text?.[lang] || article.text;
      const isNew = (today - new Date(article.published)) < TEN_DAYS;
      const readTime = Math.max(2, Math.ceil((text || article.text).split(" ").length / 180));

      const el = document.createElement("div");
      el.className = "article-item";
      el.innerHTML = `
        <span class="badge bg-${badgeColor} text-uppercase mb-2 category-badge" style="cursor:pointer;" data-category="${article.category}">${translateCategory(article.category)}</span>
        ${isNew ? `<span class="badge bg-danger ms-2">${translations?.newBadge?.[lang] || 'NEW'}</span>` : ''}
        <h5 class="fw-bold article-title">${title}</h5>
        <div class="text-muted small mb-1">${readTime} ${translations?.readTime?.[lang] || "min read"}</div>
        <p>${text}</p>
        <a href="${article.url}" class="btn btn-outline-primary" data-lang-key="readMore">Read More</a>
      `;
      el.querySelector(".article-title").textContent = title;
      const readMoreBtn = el.querySelector("[data-lang-key='readMore']");
      if (readMoreBtn) {
        readMoreBtn.textContent = translations?.readMore?.[lang] || 'Read More';
      }
      articleList.appendChild(el);
    });

    visibleCount += LOAD_BATCH;
    loadMoreBtn.style.display = (visibleCount < filtered.length) ? "inline-block" : "none";

    document.querySelectorAll(".category-badge").forEach(badge => {
      badge.addEventListener("click", () => {
        const cat = badge.dataset.category;
        document.querySelectorAll("#filterButtons .btn").forEach(b => {
          b.classList.toggle("active", b.dataset.category === cat);
        });
        currentCategory = cat;
        renderArticles(true);
        renderTopPicks();
        history.replaceState(null, "", `#${cat}`);
      });
    });
  }

  function initCategoryFilters() {
    const filterButtons = document.querySelectorAll("#filterButtons .btn");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (!filterButtons.length || !loadMoreBtn) return;

    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.getAttribute("data-category");
        renderArticles(true);
        renderTopPicks();
        history.replaceState(null, "", `#${currentCategory}`);
      });
    });

    loadMoreBtn?.addEventListener("click", () => {
      renderArticles(false);
    });
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      query = searchInput.value.toLowerCase();
      renderArticles(true);
      renderTopPicks();
    });
  }

  initCategoryFilters();
});
