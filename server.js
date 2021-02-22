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
      {
        'identitas.kredensial.username': req.body.username,
        'identitas.kredensial.keaktifan': 1
      },
      (err, patient) => patient && bcrypt.compare(
        req.body.password, patient.identitas.kredensial.password,
        (err, result) => res.send(result ? patient : {error: 'password salah'})
      )
    ))
    .post('/updatePatient', (req, res) => db.collection('patients').updateOne(
      {_id: req.body._id}, {$set: req.body},
      (err, suc) => res.send(suc || {error: 'gagal update'})
    ))
    .post('/dokterList', (req, res) =>
      db.collection('users').find({peranan: 3})
      .toArray((err, array) => res.send({res: array}))
    )
    .listen(3000)
  )
)

