let deferredPrompt;

if(!window.Promise) {
    window.Promise = Promise;
}

// register the service worker every time you enter a page in the scope.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/sw.js',
    /**
     * register takes a second argument as object {type, scope, updateViaCache}
     * {scope: '/help/'}  to overight default scope
     */ 
    )
    .then((val) => {
        console.log('service worker registered', val);
    })


    // you also can unregister all service workers

    navigator.serviceWorker.getRegistrations().then((registrations) => {
        // registrations.forEach((registration) => registration.unregister())
        console.log(registrations);
        
    })
} 

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompet fired');
    
    e.preventDefault()
    deferredPrompt = event;
    return false;
})





// /**
//  * WORKING WITH PROMISES
//  */

//  const accept = true;
// const promise = new Promise((resolve ,reject) => {
//     setTimeout(() => {
//         if(!accept) reject('test Promise [Reject]')
//          resolve('test Promise [Resolve]');
//     }, 3000);
// });

// promise.then((val) => {
//     console.log(val);
//     return 'text treated as a promise'
// })
// .then((val) => console.log(val))
// /**
//  * catch in this position will catch errors from all stages.
//  * if you want it to catch only first stage 
//  * you shoud put it right after first then
//  * 
//  */
// .catch((err) => console.log(err));




// /**
//  * WORKING WITH AJAX
//  *  note that ajax is not woring with sw because at has some syncronus process.
//  */
// const xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://httpbin.org/ip');
// xhr.responseType = 'json';

// xhr.addEventListener('load', (e) => {
//     console.log(e, xhr.response);
// });
// xhr.addEventListener('error', (e) => {
//     console.log(e);
// });
// xhr.send(); 





// /**
//  * WORKING WITH FETCH API
//  */

//  // get request
// fetch('https://httpbin.org/ip')
// .then((res) => {
//     console.log(res);
//     return res.json();
// })
// .then((data) => {
//     console.log(data);
// })
// .catch((err) => {
//     console.log(err);
// })


// //post request
// fetch('https://httpbin.org/post', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'aplication/json',
//         'Accept': 'aplication/json',
//     },
//     /**
//      * ======================I NEED TO SEARCH ABOUT IT=============
//      * mode: 'cors' 
//      *  - means ....
//      * 
//      * mode: 'no-cors'
//      *  - means ....
//      * 
//      * mode: 'same-origin'
//      *  - means ....
//      */
//     mode: 'cors',
//     body: JSON.stringify({
//         message: 'Does this work?'
//     })
// })
// .then((res) => {
//     console.log(res);
//     return res.json();
// })
// .then((data) => {
//     console.log(data);
// })
// .catch((err) => {
//     console.log(err);
// })