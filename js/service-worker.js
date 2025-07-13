// Service Worker for Scaledia
const CACHE_NAME = 'scaledia-cache-v1';

// Resources to cache on install
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/blog.html',
  '/servizi.html',
  '/chi-siamo.html',
  '/contatti.html',
  '/css/bootstrap.min.css',
  '/css/style.css',
  '/js/bootstrap.bundle.min.js',
  '/js/main.js',
  // Add other critical resources here
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

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
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

// Fetch event - network first with cache fallback strategy
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For HTML pages, use network first strategy
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to store in cache
          const clonedResponse = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, clonedResponse);
            });
            
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/offline.html');
            });
        })
    );
    return;
  }
  
  // For other resources, use stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Use cached response if available
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Update the cache with the new response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
              
            return networkResponse;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            // Return cached response or error
            return cachedResponse;
          });
          
        return cachedResponse || fetchPromise;
      })
  );
});