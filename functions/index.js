// https://firebase.google.com/docs/functions/write-firebase-functions

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.receiveTextFromTwilio = functions.https.onRequest((request, response) => {
  functions.logger.info("Received text from Twilio", { request: request.body });
  request.body.timestamp = new Date();
  admin.firestore().collection("comments").add(request.body);
  response.status(200).send();
});
