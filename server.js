var
dotenv = require('dotenv'),
express = require('express'),
mongodb = require('mongodb'),
bcryp = require('bcrypt')

app = express()
.use(express.static('public'))
.listen(3000)
