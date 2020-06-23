import __Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
console.log(__Vue);

function FetchData(accept = false) {
    this.then = function (callback) {
        setTimeout(() => {
            if (accept) callback({ hi: 'congrate' });
        }, 2000);
        return this;
    };
    this.catch = function (callback) {
        setTimeout(() => {
            if (!accept) callback(Error('Error occured. you are a loser'));
        }, 2000);
        return this;
    };
}

new FetchData(false).then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
})

function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'module';

    script.onload = () => callback(script);

    document.head.append(script);
}


function dynamicImport(src) {
    return import(src)
}

dynamicImport('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js').then((module) => {
    console.log('vue loaded', module);

})

dynamicImport('./a.js').then((module) => {
    console.log('module a.js loaded', module.default);
})


loadScript('https://cdn.jsdelivr.net/npm/vue/dist/vue.js', (script) => {
    console.log('script loaded', Vue);
})



// Thenables
new Promise((resolve, reject) => {
    return resolve('hi')
}).then((result) => {
    console.log(result);
    return {
        b: 'b'
    }
}).then((result) => {
    console.log(result);
    return {
        then: (callback) => callback({ c: 'c' }),
        d: 'd'
    }
}).then((result) => {
    console.log(result);
    return new FetchData(true)
}).then((result) => {
    console.log(result);
})



window.addEventListener('unhandledrejection', function (event) {
    event.preventDefault()
    // the event object has two special properties:
    console.log(event.promise); // [object Promise] - the promise that generated the error
    console.log(event.reason); // Error: Whoops! - the unhandled error object
});

new Promise(function () {
    throw new Error("Whoops!");
}); // no catch to handle the error




/* ====== Promise.all ====== */
const names = ['iliakan', 'remy', 'jeresig'];

const requests = names.map(name => fetch(`https://api.github.com/users/${name}`));
Promise.all(requests)
    .then(
        responses => {
            responses.forEach(res => {
                console.log(res);
            })
            return Promise.all(responses.map(r => r.json()))
        }
    )
    .then(users => users.forEach(user => console.log(user.name)));
