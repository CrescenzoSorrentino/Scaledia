document.addEventListener('DOMContentLoaded', function() {
    // Synchronize navbar category filters with article section tabs
    const syncFilters = () => {
        // Get navbar dropdown items and dropdown toggle
        const navbarDropdown = document.getElementById('navbarDropdown');
        const marketingNavLink = document.querySelector('.dropdown-menu a[href="#marketing"]');
        const financeNavLink = document.querySelector('.dropdown-menu a[href="#finance"]');
        const programmingNavLink = document.querySelector('.dropdown-menu a[href="#programming"]');

        // Get article section tabs
        const allTab = document.getElementById('all-tab');
        const marketingTab = document.getElementById('marketing-tab');
        const financeTab = document.getElementById('finance-tab');
        const programmingTab = document.getElementById('programming-tab');

        // Function to update navbar dropdown text based on selected category
        const updateNavbarDropdown = (category) => {
            if (navbarDropdown) {
                // Get the i18n text for the category
                let categoryText = '';
                if (category === 'marketing') {
                    categoryText = marketingNavLink ? marketingNavLink.textContent.trim() : 'Marketing';
                } else if (category === 'finance') {
                    categoryText = financeNavLink ? financeNavLink.textContent.trim() : 'Finanza Personale';
                } else if (category === 'programming') {
                    categoryText = programmingNavLink ? programmingNavLink.textContent.trim() : 'Programmazione';
                }

                // Keep the icon but update the text
                const icon = navbarDropdown.querySelector('i') ? navbarDropdown.querySelector('i').outerHTML + ' ' : '';
                if (categoryText) {
                    navbarDropdown.innerHTML = icon + categoryText;
                }
            }
        };

        // Add click event listeners to navbar dropdown items
        if (marketingNavLink) {
            marketingNavLink.addEventListener('click', function(e) {
                e.preventDefault();
                // Scroll to articles section
                document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
                // Activate the marketing tab
                if (marketingTab) {
                    marketingTab.click();
                }
            });
        }

        if (financeNavLink) {
            financeNavLink.addEventListener('click', function(e) {
                e.preventDefault();
                // Scroll to articles section
                document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
                // Activate the finance tab
                if (financeTab) {
                    financeTab.click();
                }
            });
        }

        if (programmingNavLink) {
            programmingNavLink.addEventListener('click', function(e) {
                e.preventDefault();
                // Scroll to articles section
                document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
                // Activate the programming tab
                if (programmingTab) {
                    programmingTab.click();
                }
            });
        }

        // Add click event listeners to article section tabs
        if (marketingTab) {
            marketingTab.addEventListener('click', function() {
                updateNavbarDropdown('marketing');
            });
        }

        if (financeTab) {
            financeTab.addEventListener('click', function() {
                updateNavbarDropdown('finance');
            });
        }

        if (programmingTab) {
            programmingTab.addEventListener('click', function() {
                updateNavbarDropdown('programming');
            });
        }

        if (allTab) {
            allTab.addEventListener('click', function() {
                // Reset navbar dropdown to default text
                if (navbarDropdown) {
                    const icon = navbarDropdown.querySelector('i') ? navbarDropdown.querySelector('i').outerHTML + ' ' : '';
                    const span = navbarDropdown.querySelector('span');
                    if (span) {
                        navbarDropdown.innerHTML = icon + span.outerHTML;
                    }
                }
            });
        }
    };

    // Initialize filter synchronization
    syncFilters();

    // Match read more button color with badge color
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const badge = card.querySelector('.badge');
        const readMoreBtn = card.querySelector('.card-footer .btn');

        if (badge && readMoreBtn) {
            // Get badge color class (e.g., bg-success, bg-primary, bg-info)
            const badgeClasses = badge.className.split(' ');
            const bgColorClass = badgeClasses.find(cls => cls.startsWith('bg-'));

            if (bgColorClass) {
                // Extract color name (e.g., success, primary, info)
                const colorName = bgColorClass.replace('bg-', '');

                // Remove existing outline color classes
                readMoreBtn.classList.forEach(cls => {
                    if (cls.startsWith('btn-outline-')) {
                        readMoreBtn.classList.remove(cls);
                    }
                });

                // Add the matching outline color class
                readMoreBtn.classList.add(`btn-outline-${colorName}`);
            }
        }
    });

    // Preload the placeholder image data URI for external images
    const externalPlaceholderImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22110.5%22%20y%3D%22107.1%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

    // Create a different placeholder for local images
    const localPlaceholderImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_2%20text%20%7B%20fill%3A%23555555%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_2%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23777777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2290.5%22%20y%3D%22107.1%22%3ECard Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

    // Realistic images for different card types
    const creditCardImage = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

    const duolingoImage = 'https://images.unsplash.com/photo-1621274147744-cfb5032bb7a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

    const marketingGlossaryImage = 'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

    const abTestImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

    const aidaModelImage = 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

    // Replace all placeholder images with realistic images
    document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || '';

        // Replace external placeholder images
        if (src && (src.includes('picsum.photos') || src.includes('via.placeholder.com'))) {
            img.setAttribute('src', externalPlaceholderImage);
        }

        // For local images that include 'placeholder.jpg', set appropriate realistic image based on context
        if (src && src.includes('placeholder.jpg')) {
            // Check alt text to determine which realistic image to use
            if (alt.includes('Credit Card')) {
                img.setAttribute('src', creditCardImage);
            } else if (alt.includes('Duolingo')) {
                img.setAttribute('src', duolingoImage);
            } else if (alt.includes('Marketing Glossary')) {
                img.setAttribute('src', marketingGlossaryImage);
            } else if (alt.includes('AB Test')) {
                img.setAttribute('src', abTestImage);
            } else if (alt.includes('AIDA Model')) {
                img.setAttribute('src', aidaModelImage);
            } else {
                // If no specific match in alt text, check parent elements for clues
                const parentCard = img.closest('.card');
                if (parentCard) {
                    const cardTitle = parentCard.querySelector('.card-title');
                    if (cardTitle) {
                        const titleText = cardTitle.textContent.toLowerCase();

                        if (titleText.includes('credit') || titleText.includes('carte di credito')) {
                            img.setAttribute('src', creditCardImage);
                        } else if (titleText.includes('duolingo')) {
                            img.setAttribute('src', duolingoImage);
                        } else if (titleText.includes('glossary') || titleText.includes('glossario')) {
                            img.setAttribute('src', marketingGlossaryImage);
                        } else if (titleText.includes('ab test') || titleText.includes('a/b')) {
                            img.setAttribute('src', abTestImage);
                        } else if (titleText.includes('aida')) {
                            img.setAttribute('src', aidaModelImage);
                        } else {
                            // Check if we're in an article page and use the appropriate image
                            const currentPath = window.location.pathname;
                            if (currentPath.includes('aida-model')) {
                                img.setAttribute('src', aidaModelImage);
                            } else if (currentPath.includes('ab-test')) {
                                img.setAttribute('src', abTestImage);
                            } else if (currentPath.includes('marketing-glossary')) {
                                img.setAttribute('src', marketingGlossaryImage);
                            } else if (currentPath.includes('credit-cards')) {
                                img.setAttribute('src', creditCardImage);
                            } else if (currentPath.includes('duolingo-case')) {
                                img.setAttribute('src', duolingoImage);
                            } else {
                                img.setAttribute('src', localPlaceholderImage);
                            }
                        }
                    } else {
                        // Check if we're in an article page and use the appropriate image
                        const currentPath = window.location.pathname;
                        if (currentPath.includes('aida-model')) {
                            img.setAttribute('src', aidaModelImage);
                        } else if (currentPath.includes('ab-test')) {
                            img.setAttribute('src', abTestImage);
                        } else if (currentPath.includes('marketing-glossary')) {
                            img.setAttribute('src', marketingGlossaryImage);
                        } else if (currentPath.includes('credit-cards')) {
                            img.setAttribute('src', creditCardImage);
                        } else if (currentPath.includes('duolingo-case')) {
                            img.setAttribute('src', duolingoImage);
                        } else {
                            img.setAttribute('src', localPlaceholderImage);
                        }
                    }
                } else {
                    // Check if we're in an article page and use the appropriate image
                    const currentPath = window.location.pathname;
                    if (currentPath.includes('aida-model')) {
                        img.setAttribute('src', aidaModelImage);
                    } else if (currentPath.includes('ab-test')) {
                        img.setAttribute('src', abTestImage);
                    } else if (currentPath.includes('marketing-glossary')) {
                        img.setAttribute('src', marketingGlossaryImage);
                    } else if (currentPath.includes('credit-cards')) {
                        img.setAttribute('src', creditCardImage);
                    } else if (currentPath.includes('duolingo-case')) {
                        img.setAttribute('src', duolingoImage);
                    } else {
                        img.setAttribute('src', localPlaceholderImage);
                    }
                }
            }
        }

        // Handle image load errors
        img.onerror = function() {
            const originalSrc = this.getAttribute('src');
            const imgAlt = this.getAttribute('alt') || '';

            // Use different placeholders for external vs local images
            if (originalSrc && (originalSrc.includes('picsum.photos') || originalSrc.includes('via.placeholder.com'))) {
                this.setAttribute('src', externalPlaceholderImage);
                console.info('External image replaced: ' + originalSrc);
            } else {
                // Check alt text for specific image type
                if (imgAlt.includes('Credit Card')) {
                    this.setAttribute('src', creditCardImage);
                } else if (imgAlt.includes('Duolingo')) {
                    this.setAttribute('src', duolingoImage);
                } else if (imgAlt.includes('Marketing Glossary')) {
                    this.setAttribute('src', marketingGlossaryImage);
                } else if (imgAlt.includes('AB Test')) {
                    this.setAttribute('src', abTestImage);
                } else if (imgAlt.includes('AIDA Model')) {
                    this.setAttribute('src', aidaModelImage);
                } else {
                    // If no specific match in alt text, check the current page URL
                    const currentPath = window.location.pathname;
                    if (currentPath.includes('aida-model')) {
                        this.setAttribute('src', aidaModelImage);
                    } else if (currentPath.includes('ab-test')) {
                        this.setAttribute('src', abTestImage);
                    } else if (currentPath.includes('marketing-glossary')) {
                        this.setAttribute('src', marketingGlossaryImage);
                    } else if (currentPath.includes('credit-cards')) {
                        this.setAttribute('src', creditCardImage);
                    } else if (currentPath.includes('duolingo-case')) {
                        this.setAttribute('src', duolingoImage);
                    } else {
                        // If still no match, check parent elements for clues
                        const parentCard = this.closest('.card');
                        if (parentCard) {
                            const cardTitle = parentCard.querySelector('.card-title');
                            if (cardTitle) {
                                const titleText = cardTitle.textContent.toLowerCase();
                                if (titleText.includes('credit') || titleText.includes('carte di credito')) {
                                    this.setAttribute('src', creditCardImage);
                                } else if (titleText.includes('duolingo')) {
                                    this.setAttribute('src', duolingoImage);
                                } else if (titleText.includes('glossary') || titleText.includes('glossario')) {
                                    this.setAttribute('src', marketingGlossaryImage);
                                } else if (titleText.includes('ab test') || titleText.includes('a/b')) {
                                    this.setAttribute('src', abTestImage);
                                } else if (titleText.includes('aida')) {
                                    this.setAttribute('src', aidaModelImage);
                                } else {
                                    this.setAttribute('src', localPlaceholderImage);
                                }
                            } else {
                                this.setAttribute('src', localPlaceholderImage);
                            }
                        } else {
                            this.setAttribute('src', localPlaceholderImage);
                        }
                    }
                }
                console.info('Local image replaced: ' + originalSrc);
            }
        }
    });

    // Animate cards to make them visible
    const animateCards = () => {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            // Add a slight delay for each card to create a staggered animation effect
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100); // 100ms delay between each card
        });
    };

    // Run the animation
    animateCards();
});
