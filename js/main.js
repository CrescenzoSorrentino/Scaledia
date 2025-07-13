// main.js
// Register Service Worker for offline support and caching
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Advanced lazy loading with Intersection Observer API
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Handle picture elements
                    if (img.tagName === 'PICTURE') {
                        const sources = img.querySelectorAll('source');
                        sources.forEach(source => {
                            if (source.dataset.srcset) {
                                source.srcset = source.dataset.srcset;
                                source.removeAttribute('data-srcset');
                            }
                        });

                        const imgElement = img.querySelector('img');
                        if (imgElement && imgElement.dataset.src) {
                            imgElement.src = imgElement.dataset.src;
                            imgElement.removeAttribute('data-src');

                            // Remove LQIP class when the full image is loaded
                            imgElement.onload = () => {
                                imgElement.classList.remove('lqip-blur');
                            };
                        }
                    } 
                    // Handle regular img elements
                    else {
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }

                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }

                        // Remove LQIP class when the full image is loaded
                        img.onload = () => {
                            img.classList.remove('lqip-blur');
                        };
                    }

                    // Stop observing the element after loading
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Start loading images when they're 50px from entering the viewport
            threshold: 0.01 // Trigger when at least 1% of the element is visible
        });

        // Observe all images and picture elements
        document.querySelectorAll('img[data-src], picture').forEach(img => {
            imageObserver.observe(img);
        });
    } 
    // Fallback for browsers that don't support Intersection Observer
    else {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            // If image doesn't have explicit dimensions, try to set them
            // to prevent layout shifts during loading
            if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
                // For featured images, use the dimensions from CSS
                if (img.classList.contains('featured-image')) {
                    img.width = 800;
                    img.height = 450;
                }
            }

            // Handle lazy loading for images with data-src attribute
            if (img.hasAttribute('data-src')) {
                img.setAttribute('loading', 'lazy');
                img.setAttribute('src', img.getAttribute('data-src'));
                img.removeAttribute('data-src');
            }

            if (img.hasAttribute('data-srcset')) {
                img.setAttribute('srcset', img.getAttribute('data-srcset'));
                img.removeAttribute('data-srcset');
            }
        });
    }

    // Count articles by category
    const categoryCounts = {};
    const articles = document.querySelectorAll('.blog-post[data-category]');

    // Count articles for each category
    articles.forEach(article => {
        const category = article.dataset.category;
        if (category) {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
    });

    // Update category counts in the sidebar
    const categoryItems = document.querySelectorAll('.sidebar-section .list-group-item');
    categoryItems.forEach(item => {
        const categoryName = item.textContent.trim().split('\n')[0].trim();
        const badge = item.querySelector('.badge');
        if (badge && categoryCounts[categoryName] !== undefined) {
            badge.textContent = categoryCounts[categoryName];
        } else if (badge && categoryCounts[categoryName] === undefined) {
            badge.textContent = '0';
        }
    });

    // Enhanced Search functionality
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
});
