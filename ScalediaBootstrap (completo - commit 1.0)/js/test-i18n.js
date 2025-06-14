// Simple test script to check for i18n errors
console.log('Testing i18n initialization...');

// Function to check if i18next is loaded
function checkI18next() {
  if (typeof i18next === 'undefined') {
    console.error('i18next is not defined! Check if the library is loaded correctly.');
    return false;
  }
  console.log('i18next is loaded correctly.');
  return true;
}

// Function to check if jQuery is loaded
function checkJQuery() {
  if (typeof jQuery === 'undefined' || typeof $ === 'undefined') {
    console.error('jQuery is not defined! Check if the library is loaded correctly.');
    return false;
  }
  console.log('jQuery is loaded correctly.');
  return true;
}

// Function to check if jqueryI18next is loaded
function checkJQueryI18next() {
  if (typeof jqueryI18next === 'undefined') {
    console.error('jqueryI18next is not defined! Check if the library is loaded correctly.');
    return false;
  }
  console.log('jqueryI18next is loaded correctly.');
  return true;
}

// Run checks when the document is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM is ready, running checks...');

  const i18nextLoaded = checkI18next();
  const jQueryLoaded = checkJQuery();
  const jqueryI18nextLoaded = checkJQueryI18next();

  if (i18nextLoaded && jQueryLoaded && jqueryI18nextLoaded) {
    console.log('All i18n libraries are loaded correctly.');
  } else {
    console.error('Some i18n libraries are missing or not loaded correctly!');
  }

  // Check if there are elements with data-i18n attributes
  const i18nElements = document.querySelectorAll('[data-i18n]');
  console.log(`Found ${i18nElements.length} elements with data-i18n attributes.`);

  // Check if translations are loaded
  if (i18nextLoaded) {
    console.log('Current language:', i18next.language);
    console.log('Available languages:', i18next.languages);
    console.log('Is initialized:', i18next.isInitialized);

    // Test country-based language detection
    console.log('Testing country-based language detection...');

    // Function to test the country detection
    async function testCountryDetection() {
      try {
        // Check if getCountryBasedLanguage function exists
        if (typeof getCountryBasedLanguage === 'function') {
          console.log('getCountryBasedLanguage function found, testing...');

          // Call the function to get the language based on country
          const countryLanguage = await getCountryBasedLanguage();
          console.log('Detected country language:', countryLanguage);

          // Check if the language is supported
          const isSupported = i18next.languages.includes(countryLanguage);
          console.log('Is language supported:', isSupported);

          return {
            success: true,
            language: countryLanguage,
            isSupported: isSupported
          };
        } else {
          console.error('getCountryBasedLanguage function not found!');
          return { success: false, error: 'Function not found' };
        }
      } catch (error) {
        console.error('Error testing country detection:', error.message);
        return { success: false, error: error.message };
      }
    }

    // Run the test
    testCountryDetection().then(result => {
      console.log('Country detection test result:', result);
    });
  }
});
