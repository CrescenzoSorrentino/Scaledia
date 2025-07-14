// main.js - Optimized with ES modules
// Import modules
import './modules/service-worker-registration.js';
import { initLazyLoading } from './modules/lazy-loading.js';
import { initBlogCategories } from './modules/blog-functions.js';
import { initSearch } from './modules/search-functions.js';

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize lazy loading
    initLazyLoading();

    // Initialize blog categories
    initBlogCategories();

    // Initialize search functionality
    initSearch();
});
