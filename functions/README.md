# Receive a message from Twilio SMS

To support comments, we use Twilio to receive a message. Twilio sends a HTTP POST request to a Firebase function. That function stores a new comment in the database.

We defined one function in `index.js` called `receiveTextFromTwilio`. This function will have a `body` and `from` field. We add an extra `timestamp` field with the current time/date. We then store this document in the Firestore database under the "comments" collection.
