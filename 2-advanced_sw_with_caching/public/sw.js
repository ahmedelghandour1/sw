/**
 * ============== note ================
 *
 * Service worker is listen and interact with events from pages or even from other web apis
 * like [ push notification, background sync ]
 *
 * Main important events:
 *
 * - Fetch
 * - Push Notification
 * - Notification Interaction
 * - Background Sync
 * - Service Worker Lifecycle
 *
 */

/**
 * ============ Service Worker lifecycle ============
 *
 * - app register sw.js through app.js
 * - installation:
 *     emits install events. this events doesn't fire when page refresh or open new tab.
 *     it fires only at the first time to register.
 *     or the sw.js file has some changes.
 *     it also used to prechace some assets.
 *
 * - activation:
 *     emits active events. sw now controls all pages of scope.
 *     it runs once installation finished. but not every time
 *
 * - idle:
 *     once there's no current process it enter this mode.
 * - terminated:
 *     it go tot sleep mode once it go to idle mode that no current process.
 *     it can be waked again once events are comming in. such as fetch event.
 */

/**
 * ============== note ================
 *
 * Service worker scope is by default the folder that it set in there.
 * best place it to but it in the root web folder to apply all html files
 */

/**
 * ===============  CACHE API ===============
 *  - Store key-value pairs, request and response.
 *  - Data can be fetched from the stored cache instead of network.
 * - it can be accessed from both sw and ordinary js files on the pages.
 *
 *
 *  METHODS:
 *  - Cache.match(request, options)
 *      Returns a Promise that resolves to the response associated with the first matching request in the Cache object.
 *
 *  - Cache.matchAll(request, options)
 *      eturns a Promise that resolves to an array of all matching requests in the Cache object.
 *
 *  - Cache.add(request)
 *       Takes a URL, retrieves it and adds the resulting response object to the given cache. This is functionally equivalent to calling fetch(), then using put() to add the results to the cache.
 *
 *  - Cache.addAll(requests)
 *      Takes an array of URLs, retrieves them, and adds the resulting response objects to the given cache.
 *
 *  - Cache.put(request, response)
 *      Takes both a request and its response and adds it to the given cache.
 *
 *  - Cache.delete(request, options)
 *      Finds the Cache entry whose key is the request, returning a Promise that resolves to true if a matching Cache entry is found and deleted. If no Cache entry is found, the promise resolves to false.
 *
 *  - Cache.keys(request, options)
 *       Returns a Promise that resolves to an array of Cache keys.
 */

(function () {
    const CACHE_STATIC_NAME = "static-v27";
    const CACHE_DYNAMIC_NAME = "dynamic-v27";
    const assetsToCache = [
        "/",
        "/index.html ",
        "/offline.html ",
        "/src/js/app.js ",
        "/src/js/feed.js ",
        "/src/js/fetch-polyfill.js ",
        "/src/js/promise-polyfill.js ",
        "/src/js/material.min.js",
        "/src/css/app.css",
        "/src/css/feed.css",
        "/src/images/main-image.jpg",
        "https://fonts.googleapis.com/css?family=Roboto:400,700",
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
    ];

    self.addEventListener("install", (event) => {
        /**
         * event.waitUntil
         *  - it prevent complete installation until the inside condition finishs.
         *
         *  - the reason to use is to prevent sw interactions
         *    before cache is ready. for example trying to
         *    fetch some assets from cache but cache is not ready for now.
         */
        event.waitUntil(
            caches.open(CACHE_STATIC_NAME).then((cache) => {
                /**
                 * app shell assets:
                 *  - it means the all nessecary files that appears on the current page
                 */
                console.log("[Service worker] Precaching App shell");
                /** cache.add(request)
                 *  - adds only one file to the cache
                 *  - request can be request object or URL
                 */

                /**
                 * cache.add('/') is added because the default route is /
                 * so without it you can't serve default route without.
                 * instead you can do that: localhost:8080/index.html
                 */

                // cache.add('/');
                // cache.add('/index.html ');
                // cache.add('/src/js/app.js ');

                /** precaching */
                cache.addAll(assetsToCache);
            })
        );
    });

    /**
     * activate event will be fired when all tabs are closed then open new tab or
     * manualy unregester old version on skipwaiting through application panel
     * to prevent breaking the last web app experience.
     */
    self.addEventListener("activate", (event) => {
        /**
         * clean up old version of caches
         */
        event.waitUntil(
            (async function () {
                const keList = await caches.keys();
                return Promise.all(
                    keList.map((key) => {
                        if (
                            key !== CACHE_STATIC_NAME &&
                            key !== CACHE_DYNAMIC_NAME
                        )
                            return caches.delete(key);
                    })
                );
            })()
        );

        return self.clients.claim();
    });





    /**
     * fetch event is fired when some assets are loading
     * such as img, script, css, manual fetch req, etc.
     *
     *
     *
     * ========== [Strategy] cache with fallback network ===========
     */

    // self.addEventListener('fetch', (event) => {
    //     /**
    //      * respondWith => expects a promise
    //      */
    //     event.respondWith(async function () {
    //         /**
    //          * in case requests is cached
    //          */
    //         let response;
    //         response = await caches.match(event.request);
    //         if (response) {
    //             return response;
    //         }

    //         /**
    //          * In case request is not cached:
    //          *  - fetch reuest from the network then update dynamic cache
    //          */
    //         try {
    //             response = await fetch(event.request);
    //             const cache = await caches.open(CACHE_DYNAMIC_NAME);

    //             if (
    //                 /* prevent chrome extenions */
    //                 event.request.url.includes('http')
    //             ) {

    //                 /**
    //                  * IMPORTANT: Clone the response. A response is a stream
    //                  * and because we want the browser to consume the response
    //                  * as well as the cache consuming the response, we need
    //                  * to clone it so we have two streams.
    //                  */

    //                 cache.put(event.request, response.clone());
    //             }
    //             /**
    //              * response should be returned to be fetched in the browser
    //              */
    //             return response;
    //         } catch (error) {
    //             /**
    //                 * Providing a fallback offline page
    //                 */

    //             /**
    //              *  To search through all caches
    //              *  return caches.match('/offline.html');
    //              */

    //             // to search trough a specific cache name
    //             const cache = await caches.open(CACHE_STATIC_NAME);
    //             return cache.match('/offline.html');
    //         }

    //     }())
    // })




    /**
     * ====== [Strategy] cache only ========
     */

    // self.addEventListener('fetch', (event) => {
    //     event.respondWith(caches.match(event.request))
    // })




    /**
     * ======= [Strategy] cache only ========
     */

    // self.addEventListener('fetch', (event) => {
    //     event.respondWith(fetch(event.request))
    // })





    /**
     * ======= [Strategy] network with cache fallback ==========
     */

    // self.addEventListener('fetch', (event) => {
    //     event.respondWith(async function () {
    //         let response;
    //         try {
    //             response = await fetch(event.request);
    //             const cache = await caches.open(CACHE_DYNAMIC_NAME);

    //             if (event.request.url.includes('http')) {
    //                 cache.put(event.request, response.clone());
    //             }

    //         } catch (error) {
    //             response = await caches.match(event.request);
    //         }
    //         return response;

    //     }());
    // })





    /**
     * ======= [Strategy] cache then network dynamic caching ==========
     *
     */

    const isInArray = (string, array) => {
        let cachePath;
        if (string.indexOf(self.origin)) {
            cachePath = string.substring(self.origin.length);
        } else {

            cachePath = string;
        }

        return array.indexOf(cachePath) > -1;
    }

    const trimCache = async (cacheName, maxItems) => {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        if(keys.length > maxItems) {
            await cache.delete(keys[0]);
            trimCache(cacheName, maxItems);
            console.log(keys.length);
        }
    }
    
    self.addEventListener("fetch", (event) => {
        event.respondWith(
            (async function () {
                let response;
                const url = "https://httpbin.org";

                if (event.request.url.indexOf(url) > -1) {

                    const cache = await caches.open(CACHE_DYNAMIC_NAME);
                    try {
                        response = await fetch(event.request);
                        await cache.put(event.request, response.clone());
                        trimCache(CACHE_DYNAMIC_NAME, 2)

                        return response;

                    } catch (error) {

                    }
                } else if (isInArray(event.request.url, assetsToCache)) {

                    return (await caches.open(CACHE_STATIC_NAME)).match(event.request.url)
                } else {
                    response = await caches.match(event.request);
                    if (response) {
                        return response;
                    }

                    try {
                        response = await fetch(event.request);
                        const cache = await caches.open(CACHE_DYNAMIC_NAME);

                        if (event.request.url.includes("http")) {
                            await cache.put(event.request, response.clone());
                            trimCache(CACHE_DYNAMIC_NAME, 2);
                        }

                        return response;
                    } catch (error) {
                        if (event.request.headers.get('accept').includes('text/html')) {
                            const cache = await caches.open(CACHE_STATIC_NAME);
                            return cache.match("/offline.html");
                        }
                    }
                }

            })()
        );
    });
})();

