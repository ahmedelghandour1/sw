var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const locationInput = document.querySelector('#location');
function openCreatePostModal() {
  // createPostArea.style.display = 'block';
  // setTimeout(function() {
  createPostArea.style.transform = 'translateY(0)';
  // }, 1);
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
  createPostArea.style.transform = 'translateY(100vh)';
  // createPostArea.style.display = 'none';
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
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
  }
}
function updateCards(data) {
  data = Object.values(data);
  data.forEach((el) => {
    if (el) createCard(el);
  })
}

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = `url(${data.thumbnail})`;
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.location;
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

const url = 'https://pwagram-ffb2e.firebaseio.com/posts.json';
let parsedFromNetwork = false;

if ('indexedDB' in window) {
  readBbData('posts').then(data => {
    if (!parsedFromNetwork) {
      console.log(data);

      clearCard();
      updateCards(data);
    }
  })
}


fetch(url)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    console.log(data);

    parsedFromNetwork = true;
    clearCard();
    updateCards(data);
  }).catch((error) => {
    console.log(error);
  })







form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (titleInput.value.trim() === '' || locationInput.value.trim() === '') {
    alert('please enter a valid data')
    return;
  }

  closeCreatePostModal();



  const post = {
    title: titleInput.value,
    location: locationInput.value,
    id: new Date().toISOString(),
    thumbnail: "https://firebasestorage.googleapis.com/v0/b/pwagram-ffb2e.appspot.com/o/sf-boat.jpg?alt=media&token=570da1a6-0c6a-4af4-a831-08622eb3d835"
  }

  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const sw = await navigator.serviceWorker.ready;
      await writeDbData('sync-posts', post)
      await sw.sync.register('sync-new-post');
      createCard(post);
    } catch (error) {
      console.log(error);
    }



  } else {
    try {
      const response = await fetch('https://us-central1-pwagram-ffb2e.cloudfunctions.net/storePostData', {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
          'Content-Type': 'aplication/json',
          'Accept': 'aplication/json',
        }
      })
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  }
})


/** =========== Fetching a post request============= */

/**
 * POST request can not be stored in the cache
 */
