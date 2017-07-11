// Name the cache container that will hold the cached elements
var FILES_CACHE = 'offlineBunnies';

// You can specify elements to be precached. They can be cached when installing the SW
var urlsToCache = [ 'index.html',
                    '.',  
                    'img/bunny1.jpg',
                    'img/bunny2.jpg',
                    'img/bunny3.jpg' ];

// Capture SW installation event to complete process prior to page reload
self.addEventListener( 'install', function(){
  return self.skipWaiting( );
});

// Capture SW activation event so that elements can be precached
self.addEventListener( 'activate', function( event ){
  // BEGIN OPTION 1
  // Pages and elements are only cached when accessed by the user while online
  //return self.clients.claim( );
  // END OPTION 1

  // BEGIN OPTION 2
  // Required logic if you want to precache elements, 
  // so user can navigate offline even before visiting certain elements
  event.waitUntil(
    caches.open( FILES_CACHE )
      .then( function( cache ) {
        console.log( 'caching 1 ' );
        return cache.addAll( urlsToCache );
      })
      .then( function( ){
        console.log( 'caching 2' );
        return self.clients.claim( );
     }) 
      .catch( function( e ){
        console.log("Error handling cache", e);
      })
  );
  // END OPTION 2
});

self.addEventListener( 'fetch', function( event ) {
  console.log( 'SW - fetch listener: ', event.request.url );
  event.respondWith(
    caches.match( event.request )
      .then(function( response ) {
      	console.log( "caching match: ", response );
        // Cache hit - return response
        if ( response ) {
          return response;
        }
      	console.log( "SW - no cache match - calling network: ", event.request.url );
        return fetch( event.request )
          // BEGIN OPTION - cache additional resources not included within the pre caching process
          // .then( function( resp ){
          //   console.log( 'SW - static resource non previously cached', resp.url );
          //   return caches.open( FILES_CACHE )
          //     .then( function( cache ) {
          //       console.log( 'SW - static resource non previously cached (now added to cache)', resp.url );
          //       cache.put( event.request, resp.clone( ));
          //       return resp;
          //     });
          // });
          // END OPTION
      })
      .catch( function( e ) {
        console.log( 'SW - Error fetching static resource from cache: ', e.message );
      })
  );
  
});
