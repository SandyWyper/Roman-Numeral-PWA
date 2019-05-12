//This is the "Offline copy of pages" service worker

//Install stage sets up the index page (home page) in the cache and opens a new cache
// self.addEventListener('install', function(event) {
//   var indexPage = new Request('index.html');
//   event.waitUntil(
//     fetch(indexPage).then(function(response) {
//       return caches.open('pwabuilder-offline').then(function(cache) {
//         console.log('[PWA Builder] Cached index page during Install '+ response.url);
//         return cache.put(indexPage, response);
//       });
//   }));
// });



// self.addEventListener('install', function(e) {
//  e.waitUntil(
//    caches.open('pwabuilder-offline').then(function(cache) {
//      return cache.addAll([
//        '/',
//        '/index.html',
//        '/converter.css',
//        '/converter.js',
//        '/fonts/im-fell-great-primer-sc-v8-latin-regular.eot',
//        '/fonts/im-fell-great-primer-sc-v8-latin-regular.svg',
//        '/fonts/im-fell-great-primer-sc-v8-latin-regular.ttf',
//        '/fonts/im-fell-great-primer-sc-v8-latin-regular.woff',
//        '/fonts/im-fell-great-primer-sc-v8-latin-regular.woff2',
//        '/images/caret-down-solid.svg',
//        '/images/random-solid.svg',
//        '/images/statue.png',
//        '/images/coin.png'
//      ]);
//    })
//  );
// });



//If any fetch fails, it will look for the request in the cache and serve it from there first
// self.addEventListener('fetch', function(event) {
//   var updateCache = function(request){
//     return caches.open('pwabuilder-offline').then(function (cache) {
//       return fetch(request).then(function (response) {
//         console.log('[PWA Builder] add page to offline '+ response.url)
//         return cache.put(request, response);
//       });
//     });
//   };

//   event.waitUntil(updateCache(event.request));

//   event.respondWith(
//     fetch(event.request).catch(function(error) {
//       console.log( '[PWA Builder] Network request Failed. Serving content from cache: ' + error );

//Check to see if you have it in the cache
//Return response
//If not in the cache, then return error page
//       return caches.open('pwabuilder-offline').then(function (cache) {
//         return cache.match(event.request).then(function (matching) {
//           var report =  !matching || matching.status == 404?Promise.reject('no-match'): matching;
//           return report
//         });
//       });
//     })
//   );
// })




//  ----------------------------------
// version1

// const cacheName = 'v1';
// const cacheAssets = [
//     'index.html',
//     'converter.css',
//     'converter.js',
//     '/fonts/im-fell-great-primer-sc-v8-latin-regular.eot',
//     '/fonts/im-fell-great-primer-sc-v8-latin-regular.svg',
//     '/fonts/im-fell-great-primer-sc-v8-latin-regular.ttf',
//     '/fonts/im-fell-great-primer-sc-v8-latin-regular.woff',
//     '/fonts/im-fell-great-primer-sc-v8-latin-regular.woff2',
//     '/images/caret-down-solid.svg',
//     '/images/random-solid.svg',
//     '/images/statue.png',
//     '/images/coin.png'
// ];



// //call Install Event
// self.addEventListener('install', function(e) {
//     console.log('Service Worker: Installed');

//     e.waitUntil(
//         caches
//         .open(cacheName)
//         .then(function(cache) {
//             console.log('Service Worker: Caching files');
//             return cache.addAll(cacheAssets);
//         })
//         .then(function() {
//             return self.skipWaiting();
//         })
//     );
// });


// //Call Activated Event
// self.addEventListener('activate', function(e) {
//     console.log('Service Worker: Activated');

//     //remove unwanted caches
//     e.waitUntil(
//         caches.keys().then(function(cacheNames) {
//             return Promise.all(
//                 cacheNames.map(function(cache) {
//                     if (cache !== cacheName) {
//                         console.log('Service Worker: clearing old cache');
//                         return caches.delete(cache);
//                     }
//                 }));
//         })
//     );
// });


// // call fetch event
// self.addEventListener('fetch', function(e){
//   console.log('Service Worker: Fetching');

//   e.respondWith(
//     fetch(e.request).catch(function() {
//       return caches.match(e.request);
//     }));
// });

// version 2
// ------------------------------------------------------------------------




const cacheName = 'v3';



//call Install Event
self.addEventListener('install', function(e) {
    console.log('Service Worker: Installed');


});


//Call Activated Event
self.addEventListener('activate', function(e) {
    console.log('Service Worker: Activated');

    //remove unwanted caches
    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cache) {
                    if (cache !== cacheName) {
                        console.log('Service Worker: clearing old cache');
                        return caches.delete(cache);
                    }
                }));
        })
    );
});


// call fetch event
self.addEventListener('fetch', function(e) {
    console.log('Service Worker: Fetching');

    e.respondWith(
        fetch(e.request)
        .then(function(res) {
            // make clone of response
            const resClone = res.clone();
            // open cache
            caches
                .open(cacheName)
                .then(function(cache) {
                    // add response to cache
                    return cache.put(e.request, resClone);
                });
            return res;
        }).catch(function(err) {
            return caches.match(e.request).then(function(res) {
                return res;
            });
        }));
});