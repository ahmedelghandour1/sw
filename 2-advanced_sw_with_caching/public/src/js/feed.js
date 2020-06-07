var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((result) => {
      console.log(result);
      if (result.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('user added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

/**
 * this function is deactivated for now.
 */
async function onSaveBtnClick(event) {
  console.log('clicked');

  if (!'cache' in window) {
    return;
  }

  const cache = await caches.open('user-request');
  console.log(cache);

  await cache.addAll([
    'https://httpbin.org/get',
    '/src/images/sf-boat.jpg'
  ]);
  // you can take action after cach successfull added.
  event.target.textContent = 'saved'

}

function clearCard() {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
  }
}

function createCard() {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = 'San Francisco Trip';
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'In San Francisco';
  cardSupportingText.style.textAlign = 'center';
  // const saveButton = document.createElement('button');
  // saveButton.addEventListener('click', onSaveBtnClick)
  // saveButton.textContent = 'Save';
  // cardWrapper.appendChild(saveButton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}


/**
 * ======= [Strategy] cache then network  ==========
 *
 */

const url = 'https://httpbin.org/';
let parsedFromNetwork = false;

if ('caches' in window) {
  caches.match(url+'get')
    .then(response => { 
      console.log(response);

      if (response) {
        return response.json();
      }
    }).then(data => {
      console.log(data);
      
      if(!parsedFromNetwork && data) {
        clearCard();
        createCard();
      }
    })
}


fetch(url+'get')
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    console.log(data);

    parsedFromNetwork = true;
    clearCard();
    createCard();
  }).catch((error) => {
    console.log(error);
  })


  /** =========== Fetching a post request============= */

  /**
   * POST request can not be stored in the cache
   */
