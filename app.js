'use strict'
let port = 3333
var express = require('express')
var multer  = require('multer')
var arrayParser = multer().array()
var essendexHandler = require('./post/essendex').push
var app = express()

app.get('/', function (req, res) {
  res.send('Hello SMS!')
});

app.post('/sms', arrayParser, essendexHandler)

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});

