// SOARA Service Worker — v1.0
// Stratégie : cache minimaliste et prudent.
// - Les assets statiques (icônes, manifest, favicon) sont mis en cache
// - Les pages HTML et l'API NE SONT PAS cachées (pour garantir la fraîcheur)
// - Les images sont cachées avec stratégie "network first, fallback cache"

const CACHE_VERSION = 'soara-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`

// Assets à précharger immédiatement à l'installation du SW
const STATIC_ASSETS = [
  '/manifest.json',
  '/favicon.ico',
  '/favicon-32.png',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
]

// Installation : on précharge les assets critiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activation : on nettoie les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => !name.startsWith(CACHE_VERSION))
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  )
})

// Fetch : stratégie différenciée selon le type de ressource
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // On ne cache que les requêtes GET sur notre propre origine
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return
  }

  // Pages HTML : network-only (pas de cache, fraîcheur prioritaire)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    return
  }

  // API routes : network-only
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // Images : network-first avec fallback cache
  if (request.destination === 'image') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Assets statiques (fonts, CSS, JS) : cache-first
  if (['style', 'script', 'font'].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone))
          }
          return response
        })
      })
    )
    return
  }
})
