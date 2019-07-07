var CACHE = 'cache-and-update'
var CACHE_VERSION = 3
var urlsToCache = [
	'/bundle.js',
	'/fonts/sblbiblit.css',
	'/fonts/hinted-subset-SBLBibLit.eot',
	'/fonts/hinted-subset-SBLBibLit.ttf',
	'/fonts/hinted-subset-SBLBibLit.woff',
	'https://fonts.googleapis.com/css?family=Open+Sans:400,700',
	'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/5.0.1/css/fabric.min.css'
]

// On install, cache some resources.
self.addEventListener('install', event => {
	self.skipWaiting();
	console.log('The service worker is being installed.')
	event.waitUntil(() => {
		return caches.open(CACHE).then(cache => {
			return cache.addAll(urlsToCache)
		})
	})
})

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName) {
					if (CACHE === cacheName) {
						console.log('Deleting out of date cache:', cacheName)
						return caches.delete(cacheName)
					}
				})
			)
		})
	)
})

self.addEventListener('fetch', event => {
	event.respondWith(fromCache(event.request))
	event.waitUntil(update(event.request))
})

function fromCache(request) {
	return caches.open(CACHE).then(cache => {
		return cache.match(request).then(matching => {
			if (matching) {
				return matching
			}
			else {
				return fetch(request).then(response => {
					return response
				})
			}
		})
	})
}

function update(request) {
	if (request.method === "POST") return null // POST can't be cached
	return caches.open(CACHE).then(cache => {
		return fetch(request).then(response => {
			return cache.put(request, response)
		})
	})
}
