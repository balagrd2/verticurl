
'use strict';

const PREFIX = 'balagrd2.github.io/pwappcontdemo/';
const HASH = 'service-worker'; // Computed at build time.
const OFFLINE_CACHE = `${PREFIX}-${HASH}`;

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(OFFLINE_CACHE).then(function(cache) {
			return cache.addAll([
				'.',
  'index.html',
  'scripts/app.js',
  'scripts/bootstrap.min.js',
  'styles/bootstrap.css',
  'styles/custom.css',
  'images/footer-bg.png',
  'images/hero-home.jpg',
  'images/verticurl-logo.png',
  'images/verticurl-logo-footer.png'
			]); // Computed at build time.
		})
	);
});

self.addEventListener('activate', function(event) {
	// Delete old asset caches.
	event.waitUntil(
		caches.keys().then(function(keys) {
			return Promise.all(
				keys.map(function(key) {
					if (
						key != OFFLINE_CACHE &&
						key.startsWith(`${PREFIX}-`)
					) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	if (event.request.mode == 'navigate') {
		console.log('Handling fetch event for', event.request.url);
		console.log(event.request);
		event.respondWith(
			fetch(event.request).catch(function(exception) {
				// The `catch` is only triggered if `fetch()` throws an exception,
				// which most likely happens due to the server being unreachable.
				console.error(
					'Fetch failed; returning offline page instead.',
					exception
				);
				return caches.open(OFFLINE_CACHE).then(function(cache) {
					return cache.match('/');
				});
			})
		);
	} else {
		// It’s not a request for an HTML document, but rather for a CSS or SVG
		// file or whatever…
		event.respondWith(
			caches.match(event.request).then(function(response) {
				return response || fetch(event.request);
			})
		);
	}
	
});

// triggered everytime, when a push notification is received.
self.addEventListener('push', function(event) {

  console.info('Event: Push');

  var title = 'Welcome to Verticurl';

  var body = {
    'body': 'Hello, Welcome to Verticurl',
    'tag': 'vrt',
    'icon': 'images/icons/icon-128x128.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, body)
  );
});


self.addEventListener('notificationclick', function(event) {

  var url = 'index.html';

  event.notification.close(); //Close the notification

  // Open the app and navigate to latest.html after clicking the notification
  event.waitUntil(
    clients.openWindow(url)
  );

});
