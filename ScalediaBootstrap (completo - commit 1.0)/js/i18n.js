// Initialize i18next
document.addEventListener('DOMContentLoaded', function() {
  // Flag to prevent infinite loops with MutationObserver
  let isLocalizing = false;

  // Debug flag - set to true to see more detailed logs
  const debug = false;

  // Log function that only outputs when debug is true
  function debugLog(...args) {
    if (debug) {
      console.log(...args);
    }
  }

  // Determine the base URL for loading translations
  const getBaseUrl = () => {
    // Get the current script path (i18n.js)
    const scripts = document.getElementsByTagName('script');
    let i18nScriptPath = '';

    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src.includes('i18n.js')) {
        i18nScriptPath = scripts[i].src;
        break;
      }
    }

    // Extract the base URL from the script path
    const baseUrl = i18nScriptPath.substring(0, i18nScriptPath.indexOf('js/i18n.js'));
    debugLog('Base URL for translations:', baseUrl);
    return baseUrl;
  };

  const baseUrl = getBaseUrl();

  // Function to get user's country and determine language
  // Make it globally accessible for testing
  window.getCountryBasedLanguage = async function() {
    try {
      // Try to get country from IP geolocation
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const countryCode = data.country_code;
      debugLog('Detected country:', countryCode);

      // Map of country codes to languages
      // Add more mappings as needed for other countries
      const countryToLanguage = {
        'IT': 'it', // Italy -> Italian
        'US': 'en', // United States -> English
        'GB': 'en', // United Kingdom -> English
        'CA': 'en', // Canada -> English
        'AU': 'en', // Australia -> English
        // Add more country-language mappings as needed
      };

      // Get language based on country, default to English if not found
      const detectedLanguage = countryToLanguage[countryCode] || 'en';
      debugLog('Setting language based on country:', detectedLanguage);

      return detectedLanguage;
    } catch (error) {
      console.error('Error detecting country:', error.message);
      return 'en'; // Default to English on error
    }
  }

  // Initialize i18next
  debugLog('Initializing i18next...');
  i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: 'en', // Changed fallback to English
      debug: false, // Turn off debug mode to reduce console output
      backend: {
        loadPath: baseUrl + 'locales/{{lng}}/translation.json'
      },
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'selectedLanguage',
        caches: ['localStorage']
      }
    })
    .then(function(t) {
      try {
        debugLog('i18next initialized successfully');

        // Check if jQuery is available
        if (typeof $ === 'undefined') {
          console.error('jQuery is not available. Make sure it is loaded before i18next.');
          return;
        }

        // Check if jqueryI18next is available
        if (typeof jqueryI18next === 'undefined') {
          console.error('jqueryI18next is not available. Make sure it is loaded before i18n.js.');
          return;
        }

        // Initialize jquery-i18next
        debugLog('Initializing jquery-i18next...');
        jqueryI18next.init(i18next, $, {
          useOptionsAttr: true
        });

        // Check if language is already set in localStorage
        const savedLanguage = localStorage.getItem('selectedLanguage');

        if (!savedLanguage) {
          // If no language is saved, detect country and set language
          getCountryBasedLanguage().then(countryLanguage => {
            // Change language based on country
            i18next.changeLanguage(countryLanguage).then(() => {
              // Update document language
              document.documentElement.lang = i18next.language;
              debugLog('Document language set to:', i18next.language);

              // Localize the page
              localizeContent();

              // Update language switcher
              updateLanguageSwitcher(i18next.language);
            });
          });
        } else {
          // If language is already saved, use it
          // Update document language
          document.documentElement.lang = i18next.language;
          debugLog('Document language set to:', i18next.language);

          // Localize the page
          localizeContent();

          // Update language switcher
          updateLanguageSwitcher(i18next.language);
        }

        // Create a MutationObserver to detect dynamically added elements
        const observer = new MutationObserver(function(mutations) {
          // Skip if we're already localizing to prevent infinite loops
          if (isLocalizing) {
            debugLog('Skipping MutationObserver callback because localization is in progress');
            return;
          }

          // Check if mutations contain nodes that need translation
          let needsTranslation = false;
          for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  if (node.querySelector('[data-i18n]') || node.hasAttribute('data-i18n')) {
                    needsTranslation = true;
                    break;
                  }
                }
              }
            }
            if (needsTranslation) break;
          }

          if (needsTranslation) {
            debugLog('New translatable elements detected, localizing content...');
            try {
              localizeContent();
            } catch (error) {
              console.error('Error in MutationObserver callback:', error.message);
            }
          }
        });

        // Start observing the document body for added nodes
        observer.observe(document.body, { childList: true, subtree: true });
        debugLog('MutationObserver started');
      } catch (error) {
        console.error('Error initializing i18next:', error.message, error.stack);
      }
    })
    .catch(function(error) {
      console.error('Error loading translations:', error.message, error.stack);
    });

  // Function to localize all content
  function localizeContent() {
    // If already localizing, don't start another localization process
    if (isLocalizing) {
      debugLog('Localization already in progress, skipping');
      return;
    }

    try {
      // Set flag to prevent infinite loops
      isLocalizing = true;
      debugLog('Localizing content...');

      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        try {
          // Set a timeout to prevent long-running localization
          const localizationTimeout = setTimeout(() => {
            if (isLocalizing) {
              console.warn('Localization is taking too long, forcing completion');
              isLocalizing = false;
            }
          }, 3000); // 3 seconds timeout

          // Apply translations
          $('body').localize();

          // Clear the timeout since localization completed normally
          clearTimeout(localizationTimeout);

          debugLog('Content localized successfully');
        } catch (error) {
          console.error('Error during localization:', error.message, error.stack);
        } finally {
          // Reset flag when done
          isLocalizing = false;
        }
      }, 50); // Small delay to ensure DOM is ready
    } catch (error) {
      console.error('Error setting up localization:', error.message, error.stack);
      isLocalizing = false;
    }
  }

  // Function to update language switcher
  function updateLanguageSwitcher(currentLang) {
    try {
      debugLog('Updating language switcher to:', currentLang);

      const languageDropdown = document.getElementById('languageDropdown');
      if (!languageDropdown) {
        console.warn('Language dropdown not found');
        return;
      }

      const dropdownMenu = languageDropdown.nextElementSibling;
      if (!dropdownMenu || !dropdownMenu.classList.contains('dropdown-menu')) {
        console.warn('Language dropdown menu not found');
        return;
      }

      const languageItems = dropdownMenu.querySelectorAll('.dropdown-item');
      if (languageItems.length === 0) {
        console.warn('Language items not found');
        return;
      }

      // Remove active class from all items and update the current one
      languageItems.forEach(item => {
        // Determine language from the item
        const itemLang = item.textContent.includes('Italiano') ? 'it' : 'en';

        // Update active state
        if (itemLang === currentLang) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // If we haven't set up the click handlers yet, do it now
      if (!dropdownMenu.hasAttribute('data-i18n-initialized')) {
        debugLog('Setting up language switcher click handlers');

        // Use event delegation instead of individual listeners
        dropdownMenu.addEventListener('click', function(e) {
          const item = e.target.closest('.dropdown-item');
          if (!item) return;

          e.preventDefault();

          // Determine which language was clicked
          const lang = item.textContent.includes('Italiano') ? 'it' : 'en';
          debugLog('Language switcher clicked, changing to:', lang);

          // Don't do anything if it's already the current language
          if (lang === i18next.language) {
            debugLog('Already using this language, no change needed');
            return;
          }

          // Change language
          i18next.changeLanguage(lang)
            .then(() => {
              debugLog('Language changed successfully to:', lang);

              // Update document language
              document.documentElement.lang = lang;

              // Localize the page
              localizeContent();

              // Update language switcher UI
              updateLanguageSwitcher(lang);
            })
            .catch(error => {
              console.error('Error changing language:', error.message);
            });
        });

        // Mark as initialized to avoid setting up listeners multiple times
        dropdownMenu.setAttribute('data-i18n-initialized', 'true');
      }

      debugLog('Language switcher updated successfully');
    } catch (error) {
      console.error('Error updating language switcher:', error.message, error.stack);
    }
  }
});
