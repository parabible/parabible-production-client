var CACHE_NAME = 'my-pwa-cache-v1'
var urlsToCache = [
	'/bundle.js',
	'/fonts/sblbiblit.css',
	'/fonts/hinted-subset-SBLBibLit.eot',
	'/fonts/hinted-subset-SBLBibLit.ttf',
	'/fonts/hinted-subset-SBLBibLit.woff',
	'https://fonts.googleapis.com/css?family=Open+Sans:400,700',
	'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/5.0.1/css/fabric.min.css'
]
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => {
				// Open a cache and cache our files
				return cache.addAll(urlsToCache)
			})
	)
})

self.addEventListener('fetch', event => {
	// console.log(event.request.url)
	// event.request.json().then(x => {
	// 	console.log(x)
	// })
	event.respondWith(
		caches.match(event.request).then(response => {
			// if (response) {
			// 	console.log("From cache!", event.request)
			// }
			return response || fetch(event.request)
		})
	)
})