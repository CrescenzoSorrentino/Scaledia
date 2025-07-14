// lazy-loading.js
// Advanced lazy loading with Intersection Observer API
export function initLazyLoading() {
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
}