var
dotenv = require('dotenv').config(),
express = require('express'),
mongodb = require('mongodb'),
bodyParser = require('body-parser'),
bcrypt = require('bcrypt'),
withThis = (obj, cb) => cb(obj)

mongodb.MongoClient.connect(
  process.env.MONGO,
  {useNewUrlParser: true, useUnifiedTopology: true},
  (err, client) => err ? console.log(err) : withThis(
    client.db(process.env.dbname),
    db => express()
    .use(express.static('public'))
    .use(bodyParser.json())
    .post('/login', (req, res) => db.collection('patients').findOne(
      {'identitas.kredensial.username': req.body.username},
      (err, patient) => patient && bcrypt.compare(
        req.body.password, patient.identitas.kredensial.password,
        (err, result) => res.send(result ? patient : {error: 'password salah'})
      )
    ))
    .listen(3000)
  )
)

