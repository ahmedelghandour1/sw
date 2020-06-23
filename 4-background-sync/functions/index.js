const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pwagram-ffb2e.firebaseio.com"
});

exports.storePostData = functions.https.onRequest((request, response) => {
 cors(request, response, async () => {
    try {
        await admin.database().ref('posts').push({
            id: request.body.id,
            title: request.body.title,
            location: request.body.location,
            thumbnail: request.body.thumbnail
        });
        response.status(201).json({message: 'Data stored', id: request.body.id})
    } catch (error) {
        response.status(500).json({error})
    }
 });
});
