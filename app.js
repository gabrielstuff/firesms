'use strict'
let port = 3333
var express = require('express')
var multer  = require('multer')
const settings = require('standard-settings').getSettings()
var arrayParser = multer().array()
var essendexHandler = require('./post/esendex').push
var app = express()

var admin = require("firebase-admin")

var serviceAccount = require(settings.service.firebase.key.path)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${settings.service.firebase.database.name}.firebaseio.com` 
})


function writeNewSMS(uid, body, author) {
  // A post entry.
  var postData = {
    uid: uid,
    body: body,
    author: author,
    createdAt: admin.database.ServerValue.TIMESTAMP,
    display: true
  }

  // Get a key for a new Post.
  var newPostKey = admin.database().ref().child('sms').push().key

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {}
  updates['/sms/' + newPostKey] = postData
  return admin.database().ref().update(updates)
}

app.get('/', function (req, res) {
  res.send('Hello SMS!')
});

app.post('/sms', arrayParser, (req, res)=>{
  essendexHandler(req, res, (error, message)=>{
    if(error){
      console.error(error)
    } else {
      writeNewSMS(message.uid, message.body, message.author)
    }
  })
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});

