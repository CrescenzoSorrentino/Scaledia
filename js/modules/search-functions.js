// search-functions.js
// Enhanced Search functionality

// Initialize search functionality
export function initSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const searchQuery = searchInput.value.trim().toLowerCase();
            if (searchQuery === '') {
                // If search query is empty, show all posts
                showAllPosts();
                return;
            }

            // Check if we're on the blog index page or an article page
            const isArticlePage = document.querySelector('.article-content') !== null;

            if (isArticlePage) {
                // On article page, search within the article content
                searchInArticle(searchQuery);
            } else {
                // On blog index page, filter posts based on search query
                filterPosts(searchQuery);
            }
        });
    }
}

// Function to search within an article page
function searchInArticle(query) {
    const articleContent = document.querySelector('.article-content');
    const articleTitle = document.querySelector('.blog-post-title');
    let foundResults = false;
    let matchCount = 0;

    // Create search results container if it doesn't exist
    let searchResults = document.getElementById('searchResults');
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.id = 'searchResults';
        searchResults.className = 'alert alert-info mt-3';
        articleContent.parentNode.insertBefore(searchResults, articleContent);
    }

    // Check if query is in title
    if (articleTitle && articleTitle.textContent.toLowerCase().includes(query)) {
        foundResults = true;
        matchCount++;
    }

    // Check if query is in content
    const contentText = articleContent.textContent.toLowerCase();
    const matches = contentText.split(query).length - 1;
    if (matches > 0) {
        foundResults = true;
        matchCount += matches;
    }

    if (foundResults) {
        // Show search results message
        searchResults.innerHTML = `<strong>Trovati ${matchCount} risultati</strong> per la ricerca: "${query}"`;
        searchResults.style.display = 'block';

        // Scroll to first occurrence
        const firstOccurrence = findFirstOccurrence(articleContent, query);
        if (firstOccurrence) {
            firstOccurrence.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else {
        // Show no results message
        searchResults.innerHTML = `<strong>Nessun risultato trovato</strong> per la ricerca: "${query}"<br>
            <a href="../blog.html" class="btn btn-sm btn-primary mt-2">Cerca in tutti gli articoli</a>`;
        searchResults.style.display = 'block';
    }
}

// Function to find the first occurrence of a term in content
function findFirstOccurrence(container, term) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while (node = walker.nextNode()) {
        if (node.nodeValue.toLowerCase().includes(term)) {
            return node.parentNode;
        }
    }

    return null;
}

// Function to filter posts based on search query
function filterPosts(query) {
    const blogPosts = document.querySelectorAll('.blog-post');
    let foundResults = false;
    let matchCount = 0;

    blogPosts.forEach(post => {
        const postTitle = post.querySelector('.blog-post-title').textContent.toLowerCase();
        // Search in all paragraphs, not just the first one
        const paragraphs = post.querySelectorAll('p');
        let postContent = '';
        paragraphs.forEach(p => {
            postContent += p.textContent.toLowerCase() + ' ';
        });

        // Also search in headings and other content
        const headings = post.querySelectorAll('h2, h3, h4, h5, h6');
        let headingContent = '';
        headings.forEach(h => {
            headingContent += h.textContent.toLowerCase() + ' ';
        });

        if (postTitle.includes(query) || postContent.includes(query) || headingContent.includes(query)) {
            post.style.display = 'block';
            foundResults = true;
            matchCount++;
        } else {
            post.style.display = 'none';
        }
    });

    // Show message with results count
    const paginationElement = document.querySelector('.blog-pagination');
    const blogPostsContainer = document.querySelector('.col-md-8');

    if (!foundResults) {
        // Create or update no results message
        let noResultsMsg = document.getElementById('noResultsMessage');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMessage';
            noResultsMsg.className = 'alert alert-info mt-3';
            noResultsMsg.innerHTML = `<strong>Nessun risultato trovato</strong> per la ricerca: "${query}"<br>
                <small>Prova con termini diversi o più generici.</small>`;

            // Insert before pagination
            blogPostsContainer.insertBefore(noResultsMsg, paginationElement);
        } else {
            noResultsMsg.innerHTML = `<strong>Nessun risultato trovato</strong> per la ricerca: "${query}"<br>
                <small>Prova con termini diversi o più generici.</small>`;
            noResultsMsg.style.display = 'block';
        }

        // Hide pagination when no results
        if (paginationElement) {
            paginationElement.style.display = 'none';
        }
    } else {
        // Create or update results message
        let resultsMsg = document.getElementById('noResultsMessage');
        if (!resultsMsg) {
            resultsMsg = document.createElement('div');
            resultsMsg.id = 'noResultsMessage';
            resultsMsg.className = 'alert alert-success mt-3';
            resultsMsg.innerHTML = `<strong>Trovati ${matchCount} risultati</strong> per la ricerca: "${query}"`;

            // Insert before pagination
            blogPostsContainer.insertBefore(resultsMsg, paginationElement);
        } else {
            resultsMsg.innerHTML = `<strong>Trovati ${matchCount} risultati</strong> per la ricerca: "${query}"`;
            resultsMsg.className = 'alert alert-success mt-3';
            resultsMsg.style.display = 'block';
        }

        // Show pagination when results are found
        if (paginationElement) {
            paginationElement.style.display = 'block';
        }
    }
}

// Function to show all posts
function showAllPosts() {
    const blogPosts = document.querySelectorAll('.blog-post');
    blogPosts.forEach(post => {
        post.style.display = 'block';
    });

    // Hide no results message if it exists
    const noResultsMsg = document.getElementById('noResultsMessage');
    if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }

    // Show pagination
    const paginationElement = document.querySelector('.blog-pagination');
    if (paginationElement) {
        paginationElement.style.display = 'block';
    }
}