
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("preferredLang") || "en";

  // --- USER ID ANONIMO ---
  if (!localStorage.getItem('user_id')) {
    const randomId = 'anon_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('user_id', randomId);
  }
  const userId = localStorage.getItem('user_id');
  gtag('set', 'user_id', userId);
  // --- FINE USER ID ---

  document.documentElement.lang = lang;

  const translationPath = location.pathname.includes("/articles/") ? "../articles-data/translations.json" : "articles-data/translations.json";

  fetch(translationPath)
    .then(res => res.json())
    .then(data => {
      applyTranslations(lang, data);
      updateMetaTags(lang);

      document.querySelectorAll(".language-option").forEach(option => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          const selectedLang = e.target.dataset.lang;
          localStorage.setItem("preferredLang", selectedLang);
          applyTranslations(selectedLang, data);
          updateMetaTags(selectedLang);
          location.reload();
        });
      });
    });

  initCategoryFilters();
  initScroll();
});

function applyTranslations(lang, data) {
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

function updateMetaTags(lang) {
  const metaData = {
    "en": {
      "index": { "title": "Scaledia | Growth, Marketing & Finance Without Fluff", "description": "Scaledia helps creators and marketers grow smarter. Discover real strategies about growth hacking, marketing and money." },
      "articles": { "title": "All Articles | Scaledia", "description": "Browse all growth, finance and marketing guides." },
      "duolingo-growth-hacking-case-study": { "title": "Duolingo: Growth Hacker in Disguise", "description": "A deep dive into Duolingo’s viral loop, gamification and product-driven growth." },
      "credit-cards": { "title": "Credit Cards: How to Use Them Without Regret", "description": "Smart and practical strategies to use credit cards in your favor. No fluff, just facts." },
      "marketing-glossary": { "title": "Marketing Glossary: Speak the Language of Strategy", "description": "25+ acronyms explained clearly and without fluff." }
    },
    "it": {
      "index": { "title": "Scaledia | Marketing, Crescita e Finanza Senza Fuffa", "description": "Scaledia aiuta creator e marketer a crescere in modo intelligente. Strategie reali su crescita, marketing e soldi." },
      "articles": { "title": "Tutti gli Articoli | Scaledia", "description": "Sfoglia guide su crescita, finanza e marketing." },
      "duolingo-growth-hacking-case-study": { "title": "Duolingo: Il Genio del Growth Hacking", "description": "Strategie virali, gamification e crescita senza pubblicità." },
      "credit-cards": { "title": "Carte di Credito: Usarle Senza Rimpianti", "description": "Strategie pratiche per usare le carte a tuo vantaggio. Zero fuffa." },
      "marketing-glossary": { "title": "Glossario Marketing: Parla il Linguaggio della Strategia", "description": "25+ termini chiave spiegati con esempi veri." }
    },
    "es": {
      "index": { "title": "Scaledia | Crecimiento, Marketing y Finanzas Sin Relleno", "description": "Scaledia ayuda a creadores y marketers a crecer con inteligencia. Estrategias reales sobre crecimiento, marketing y dinero." },
      "articles": { "title": "Todos los Artículos | Scaledia", "description": "Explora guías sobre crecimiento, finanzas y marketing." },
      "duolingo-growth-hacking-case-study": { "title": "Duolingo: El Hacker del Crecimiento", "description": "Gamificación viral, bucles de producto y crecimiento sin anuncios." },
      "credit-cards": { "title": "Tarjetas de Crédito: Úsalas Sin Arrepentimientos", "description": "Estrategias prácticas para usar tarjetas a tu favor. Nada de relleno." },
      "marketing-glossary": { "title": "Glosario de Marketing: Habla el Lenguaje de la Estrategia", "description": "25+ términos clave explicados sin tecnicismos." }
    },
    "zh": {
      "index": { "title": "Scaledia | 增长、营销与理财，不说空话", "description": "Scaledia 帮助创作者和营销人员更聪明地成长。深入探讨真实策略。" },
      "articles": { "title": "所有文章 | Scaledia", "description": "探索增长、理财与营销的实用指南。" },
      "duolingo-growth-hacking-case-study": { "title": "Duolingo：伪装的增长黑客", "description": "游戏化、产品驱动增长与用户自传播的案例剖析。" },
      "credit-cards": { "title": "信用卡：如何巧用不后悔", "description": "使用信用卡的实用策略，无废话。" },
      "marketing-glossary": { "title": "营销术语表：掌握策略语言", "description": "25+ 重要术语，清晰解释，无废话。" }
    }
  };

  const path = window.location.pathname.split("/").pop().replace(".html", "") || "index";
  const page = metaData[lang]?.[path] || metaData["en"]["index"];

  document.title = page.title;
  if (document.getElementById("metaTitle")) document.getElementById("metaTitle").textContent = page.title;
  if (document.getElementById("metaDescription")) document.getElementById("metaDescription").setAttribute("content", page.description);
  if (document.getElementById("ogTitle")) document.getElementById("ogTitle").setAttribute("content", page.title);
  if (document.getElementById("ogDescription")) document.getElementById("ogDescription").setAttribute("content", page.description);
  if (document.getElementById("twitterTitle")) document.getElementById("twitterTitle").setAttribute("content", page.title);
  if (document.getElementById("twitterDescription")) document.getElementById("twitterDescription").setAttribute("content", page.description);
  if (document.getElementById("ogUrl")) document.getElementById("ogUrl").setAttribute("content", window.location.href);
  if (document.getElementById("canonicalLink")) document.getElementById("canonicalLink").setAttribute("href", window.location.href);
}

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

