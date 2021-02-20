var
dotenv = require('dotenv').config(),
express = require('express'),
mongodb = require('mongodb'),
bcrypt = require('bcrypt')

mongodb.MongoClient.connect(
  process.env.MONGO,
  {useNewUrlParser: true, useUnifiedTopology: true},
  (err, client) => err ? console.log(err) :
    express()
    .use(express.static('public'))
    .post('/login', (req, res) => res.send({a: 1}))
    .listen(3000)
)

