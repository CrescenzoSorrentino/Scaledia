
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("preferredLang") || "en";
  document.documentElement.lang = lang;

  let translations = {};
  let articlesTranslations = {};
  let currentCategory = "all";
  let query = "";
  let visibleCount = 0;
  const LOAD_BATCH = 3;

  const validCategories = ["finance", "marketing", "growth", "all"];
  const hash = window.location.hash.replace("#", "");
  if (validCategories.includes(hash)) {
    currentCategory = hash;
    setTimeout(() => {
      const blogSection = document.getElementById("blog");
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: "smooth" });
      }

      
      const messagesByLang = {
        en: {
          finance: "Welcome to our Finance articles!",
          marketing: "Welcome to the Marketing Lab!",
          growth: "Welcome to the Growth Hub!"
        },
        it: {
          finance: "Benvenuto nei nostri articoli su Finanza!",
          marketing: "Benvenuto nel Marketing Lab!",
          growth: "Benvenuto nel Growth Hub!"
        },
        es: {
          finance: "¡Bienvenido a nuestros artículos sobre Finanzas!",
          marketing: "¡Bienvenido al Laboratorio de Marketing!",
          growth: "¡Bienvenido al Centro de Crecimiento!"
        },
        zh: {
          finance: "歡迎來到我們的財務文章區！",
          marketing: "歡迎來到行銷實驗室！",
          growth: "歡迎來到成長駭客中心！"
        }
      };
      const messages = messagesByLang[lang] || messagesByLang.en;

      
      if (messages[hash] && !sessionStorage.getItem("modalShown")) {
        const modalText = document.getElementById("modalMessage");
        if (modalText) modalText.textContent = messages[hash];
        const modal = new bootstrap.Modal(document.getElementById("categoryModal"));
        modal.show();
        sessionStorage.setItem("modalShown", "true");
      }

    }, 300);
  }

  const articles = [
    {
      id: "creditCards",
      title: "Credit Cards: Practical Guide to Use Them Smart",
      text: "Learn how to use credit cards smartly: tips, risks, and practical strategies.",
      category: "finance",
      url: "articles/credit-cards.html"
    },
    {
      id: "duolingo",
      title: "Duolingo: Growth Hacker in Disguise",
      text: "A growth hack masterclass: how Duolingo made language learning addictive.",
      category: "growth",
      url: "articles/duolingo-growth-hacking-case-study.html"
    },
    {
      id: "marketingGlossary",
      title: "Practical Marketing Glossary",
      text: "25 key acronyms explained with no fluff. Just what matters, clearly.",
      category: "marketing",
      url: "articles/marketing-glossary.html",
      featured: true
    },
    {
      id: "abTest",
      title: "A/B Test: The Secret Weapon",
      text: "Discover how A/B tests can double your conversions by changing just a few words.",
      category: "marketing",
      url: "articles/ab-test.html",
      featured: true
    }
  ];

  fetch("articles-data/home.json")
    .then(res => res.json())
    .then(data => {
      translations = data;
      applyTranslationsHome(translations, lang);
      articlesTranslations = data.articlesCards || {};

      document.querySelectorAll(".language-option").forEach(option => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          const selectedLang = e.target.dataset.lang;
          localStorage.setItem("preferredLang", selectedLang);
          location.reload();
        });
      });

      renderArticles(true);
      renderTopPicks();

      document.querySelectorAll("#filterButtons .btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.category === currentCategory);
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

    const topPicks = articles.filter(a => a.featured).slice(0, 3);
    container.innerHTML = "";
    topPicks.forEach(article => {
      const badgeColor = article.category === "finance" ? "success"
                        : article.category === "growth" ? "purple"
                        : "info";

      const t = articlesTranslations[article.id];
      const title = t?.title?.[lang] || article.title;
      const text = t?.text?.[lang] || article.text;

      const el = document.createElement("div");
      el.className = "col-md-6";
      el.innerHTML = `
        <div class="p-4 border rounded shadow-sm h-100">
          <span class="badge bg-${badgeColor} text-uppercase mb-2">${translateCategory(article.category)}</span>
          <h5 class="fw-bold">${title}</h5>
          <p class="mb-2 text-muted">${text}</p>
          <a class="btn btn-sm btn-outline-primary" href="${article.url}" data-lang-key="readMore">Read More</a>
        </div>
      `;
      container.appendChild(el);
    });

    applyTranslationsHome(translations, lang);
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
      const matchQuery = article.title.toLowerCase().includes(query) || article.text.toLowerCase().includes(query);
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

      const el = document.createElement("div");
      el.className = "article-item";
      el.innerHTML = `
        <span class="badge bg-${badgeColor} text-uppercase mb-2">${translateCategory(article.category)}</span>
        <h5>${title}</h5>
        <p>${text}</p>
        <a href="${article.url}" class="btn btn-outline-primary" data-lang-key="readMore">Read More</a>
      `;
      articleList.appendChild(el);
    });

    visibleCount += LOAD_BATCH;
    loadMoreBtn.style.display = (visibleCount < filtered.length) ? "inline-block" : "none";

    applyTranslationsHome(translations, lang);
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

  initCategoryFilters();
  initScroll();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      query = searchInput.value.toLowerCase();
      renderArticles(true);
      renderTopPicks();
    });
  }

  function initScroll() {
    const scrollIcon = document.querySelector('.scroll-indicator i');
    if (scrollIcon) scrollIcon.style.animation = "bounceCustom 2s infinite";

    const scrollBtn = document.querySelector('.scroll-button');
    const scrollTarget = document.querySelector('#content');
    if (scrollBtn && scrollTarget) {
      scrollBtn.addEventListener('click', function (e) {
        e.preventDefault();
        scrollTarget.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }
});
