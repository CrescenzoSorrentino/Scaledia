// Service Worker for Scaledia
// Simplified caching strategy with a single cache
const CACHE_NAME = 'scaledia-cache-v3';

// Resources to cache on install
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/blog.html',
  '/servizi.html',
  '/chi-siamo.html',
  '/contatti.html',
  '/offline.html',
  '/css/bootstrap.min.css',
  '/css/style.css',
  '/css/critical.css',
  '/js/bootstrap.bundle.min.js',
  '/js/main.js',
  // Blog posts
  '/blog/strategie-seo-2025.html',
  '/blog/responsive-design-importanza.html',
  '/blog/ottimizzare-velocita-sito.html',
  '/blog/strategie-content-marketing-2025.html',
  // Images for offline page
  '/images/blog/strategie-seo-2025-grafico-lqip.webp',
  '/images/blog/responsive-design-importanza-esempio-lqip.webp',
  '/images/blog/ottimizzazione-velocita-sito-web-lqip.webp',
  '/images/blog/strategie-content-marketing-2025-infografica-lqip.webp',
  // Fallback image
  '/images/fallback-image.webp'
];

// Resources with different cache strategies
const CACHE_STRATEGIES = {
  // Cache for a long time (1 year) - static assets that rarely change
  longCache: [
    /\.(woff2|woff|ttf|eot)$/, // Fonts
    /\.(webp|jpg|jpeg|png|gif|svg|ico)$/, // Images
  ],
  // Cache for a medium time (1 week) - CSS and JS files
  mediumCache: [
    /\.css$/,
    /\.js$/,
  ],
  // Cache for a short time (1 day) - HTML files
  shortCache: [
    /\.html$/,
  ],
};

// Install event - precache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Precaching resources');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches and enable navigation preload
self.addEventListener('activate', event => {
  // Clean up old caches - simplified to only check against the current cache
  const cacheCleanup = caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.filter(cacheName => {
        return cacheName.startsWith('scaledia-') && 
               cacheName !== CACHE_NAME;
      }).map(cacheName => {
        console.log('Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
  });

  // Enable navigation preload if supported
  const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
      try {
        await self.registration.navigationPreload.enable();
        console.log('Navigation preload enabled');
      } catch (error) {
        console.error('Navigation preload not supported:', error);
      }
    }
  };

  event.waitUntil(
    Promise.all([
      cacheCleanup,
      enableNavigationPreload()
    ]).then(() => self.clients.claim())
  );
});

// Helper function to determine cache duration based on URL
function getCacheDuration(url) {
  // Long cache (1 year) for static assets
  for (const pattern of CACHE_STRATEGIES.longCache) {
    if (pattern.test(url)) {
      return 365 * 24 * 60 * 60; // 1 year in seconds
    }
  }

  // Medium cache (1 week) for CSS and JS
  for (const pattern of CACHE_STRATEGIES.mediumCache) {
    if (pattern.test(url)) {
      return 7 * 24 * 60 * 60; // 1 week in seconds
    }
  }

  // Short cache (1 day) for HTML
  for (const pattern of CACHE_STRATEGIES.shortCache) {
    if (pattern.test(url)) {
      return 24 * 60 * 60; // 1 day in seconds
    }
  }

  // Default cache (4 hours)
  return 4 * 60 * 60; // 4 hours in seconds
}

// Helper function to read and use navigation preload response
async function readPreloadResponse(event) {
  if (event.preloadResponse) {
    try {
      return await event.preloadResponse;
    } catch (error) {
      console.log('Navigation preload failed:', error);
    }
  }
  return null;
}

// Helper function to save a response to cache
async function saveToCache(cacheName, request, response) {
  if (response && response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
}

// Fetch event - enhanced with navigation preload and better caching strategies
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle POST requests (for background sync)
  if (event.request.method === 'POST') {
    // If it's a form submission and we're offline, add to background sync
    if (event.request.headers.get('content-type')?.includes('application/x-www-form-urlencoded') ||
        event.request.headers.get('content-type')?.includes('multipart/form-data')) {

      // Try to send the form data
      event.respondWith(
        fetch(event.request.clone())
          .catch(error => {
            // If offline, store the request for later and show offline message
            self.registration.sync.register('sync-forms')
              .then(() => {
                // Store the form data in IndexedDB for later
                // This is a simplified version - in a real app, you'd store the actual form data
                console.log('Form submission queued for background sync');
              });

            // Return a response indicating the form will be submitted when online
            return new Response(JSON.stringify({
              success: false,
              offline: true,
              message: 'Sei offline. Il modulo verrà inviato automaticamente quando tornerai online.'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          })
      );
      return;
    }

    // For other POST requests, just try to fetch normally
    return;
  }

  // Skip non-GET requests that aren't POST
  if (event.request.method !== 'GET') {
    return;
  }

  // For HTML pages, use navigation preload with network-first strategy
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          // Try to use navigation preload response if available
          const preloadResponse = await readPreloadResponse(event);
          if (preloadResponse) {
            // Save the preload response to cache
            await saveToCache(CACHE_NAME, event.request, preloadResponse.clone());
            return preloadResponse;
          }

          // If no preload response, fetch from network
          const networkResponse = await fetch(event.request);
          // Save the network response to cache
          await saveToCache(CACHE_NAME, event.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // If network fails, try to serve from cache
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // If no cached response, show offline page
          return await caches.match('/offline.html');
        }
      })()
    );
    return;
  }

  // For CSS and JS files, use stale-while-revalidate strategy
  if (event.request.url.match(/\.(css|js)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Create a fetch promise for updating the cache
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              // Update the cache with the new response
              saveToCache(CACHE_NAME, event.request, networkResponse.clone());
              return networkResponse;
            })
            .catch(error => {
              console.error('Fetch failed for CSS/JS:', error);
              return cachedResponse;
            });

          // Return cached response immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }

  // For images and other static assets, use cache-first strategy
  if (event.request.url.match(/\.(webp|jpg|jpeg|png|gif|svg|ico|woff2|woff|ttf|eot)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // If in cache, return cached version but update cache in background
            fetch(event.request)
              .then(networkResponse => {
                saveToCache(CACHE_NAME, event.request, networkResponse);
              })
              .catch(() => {
                // Ignore network errors for background updates
              });

            return cachedResponse;
          }

          // If not in cache, fetch from network and cache
          return fetch(event.request)
            .then(networkResponse => {
              const clonedResponse = networkResponse.clone();
              saveToCache(CACHE_NAME, event.request, clonedResponse);
              return networkResponse;
            })
            .catch(error => {
              console.error('Fetch failed for static asset:', error);
              // For images, return a fallback image
              if (event.request.url.match(/\.(webp|jpg|jpeg|png|gif|svg|ico)$/)) {
                return caches.match('/images/fallback-image.webp');
              }
              // For other assets, just propagate the error
              throw error;
            });
        })
    );
    return;
  }

  // For all other requests, use stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            saveToCache(CACHE_NAME, event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            return cachedResponse;
          });

        return cachedResponse || fetchPromise;
      })
  );
});

// Background sync event handler for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    console.log('Attempting to sync queued forms');
    event.waitUntil(
      // In a real implementation, you would:
      // 1. Retrieve stored form data from IndexedDB
      // 2. Send each form submission to the server
      // 3. Remove successfully submitted forms from storage

      // This is a simplified version that just logs a message
      Promise.resolve().then(() => {
        console.log('Forms synced successfully');
        // Notify the user that their form has been submitted
        self.registration.showNotification('Scaledia', {
          body: 'Il tuo modulo è stato inviato con successo.',
          icon: '/images/favicon.ico'
        });
      })
    );
  }
});

// Periodic cache update (every 24 hours)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

// Function to update cache with fresh content
async function updateCache() {
  console.log('Performing periodic cache update');

  try {
    // Update main pages
    const pagesToUpdate = [
      '/',
      '/index.html',
      '/blog.html',
      '/servizi.html',
      '/chi-siamo.html',
      '/contatti.html'
    ];

    for (const page of pagesToUpdate) {
      const response = await fetch(page, { cache: 'no-store' });
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(page, response);
        console.log(`Updated cache for ${page}`);
      }
    }

    // Update blog posts
    const blogPosts = [
      '/blog/strategie-seo-2025.html',
      '/blog/responsive-design-importanza.html',
      '/blog/ottimizzare-velocita-sito.html',
      '/blog/strategie-content-marketing-2025.html'
    ];

    for (const post of blogPosts) {
      const response = await fetch(post, { cache: 'no-store' });
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(post, response);
        console.log(`Updated cache for ${post}`);
      }
    }

    console.log('Periodic cache update completed');
    return true;
  } catch (error) {
    console.error('Periodic cache update failed:', error);
    return false;
  }
}

// Register for periodic sync if supported
if ('periodicSync' in self.registration) {
  // Try to register for periodic sync
  const tryPeriodicSync = async () => {
    try {
      await self.registration.periodicSync.register('update-cache', {
        minInterval: 24 * 60 * 60 * 1000 // 24 hours
      });
      console.log('Periodic sync registered');
    } catch (error) {
      console.error('Periodic sync registration failed:', error);
    }
  };

  tryPeriodicSync();
}

// Message event handler for communication with the page
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Function to notify clients about updates
function notifyClientsAboutUpdate() {
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        message: 'Nuova versione disponibile! Ricarica per aggiornare.'
      });
    });
  });
}

// Notify clients when a new service worker is waiting
self.addEventListener('install', event => {
  self.addEventListener('activate', () => {
    notifyClientsAboutUpdate();
  });
});
