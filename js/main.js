// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Convert data-src attributes to native lazy loading
    // This ensures images are properly indexed by search engines
    // while still benefiting from lazy loading
    const images = document.querySelectorAll('img[data-src]');

    images.forEach(img => {
        const src = img.dataset.src;

        if (!src) {
            console.warn('Image loading: data-src attribute is empty for', img);
            return;
        }

        // Set up error handling
        img.onerror = function() {
            console.error('Failed to load image:', src);
            // Optionally set a fallback image
            // img.src = 'path/to/fallback-image.jpg';
        };

        // Set native lazy loading attribute
        img.loading = 'lazy';

        // Set src attribute for search engines and browsers
        img.src = src;

        // If image doesn't have explicit dimensions, try to set them
        // to prevent layout shifts during loading
        if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
            // For featured images, use the dimensions from CSS
            if (img.classList.contains('featured-image')) {
                img.width = 800;
                img.height = 450;
            }
        }

        // Remove data-src attribute as it's no longer needed
        img.removeAttribute('data-src');
    });

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

    // Search functionality
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

            // Filter posts based on search query
            filterPosts(searchQuery);
        });
    }

    // Function to filter posts based on search query
    function filterPosts(query) {
        const blogPosts = document.querySelectorAll('.blog-post');
        let foundResults = false;

        blogPosts.forEach(post => {
            const postTitle = post.querySelector('.blog-post-title').textContent.toLowerCase();
            const postContent = post.querySelector('p').textContent.toLowerCase();

            if (postTitle.includes(query) || postContent.includes(query)) {
                post.style.display = 'block';
                foundResults = true;
            } else {
                post.style.display = 'none';
            }
        });

        // Show message if no results found
        const paginationElement = document.querySelector('.blog-pagination');

        if (!foundResults) {
            // Create or update no results message
            let noResultsMsg = document.getElementById('noResultsMessage');
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'noResultsMessage';
                noResultsMsg.className = 'alert alert-info mt-3';
                noResultsMsg.textContent = 'Nessun risultato trovato per la ricerca: "' + query + '"';

                // Insert before pagination
                const blogPostsContainer = document.querySelector('.col-md-8');
                blogPostsContainer.insertBefore(noResultsMsg, paginationElement);
            } else {
                noResultsMsg.textContent = 'Nessun risultato trovato per la ricerca: "' + query + '"';
                noResultsMsg.style.display = 'block';
            }

            // Hide pagination when no results
            if (paginationElement) {
                paginationElement.style.display = 'none';
            }
        } else {
            // Hide no results message if it exists
            const noResultsMsg = document.getElementById('noResultsMessage');
            if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
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
