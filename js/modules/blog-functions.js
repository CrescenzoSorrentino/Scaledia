// blog-functions.js
// Functions for blog-related functionality

// Count articles by category and update sidebar
export function initBlogCategories() {
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
}