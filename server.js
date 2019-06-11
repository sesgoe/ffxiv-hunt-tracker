const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const history = require('connect-history-api-fallback')

require('dotenv').config()

const database = require('./server/database')
const passport = require('./server/api/passport')
const discord = require('./server/api/discord')
const room = require('./server/api/room')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// API calls
passport(app, null)
discord(app, null)
room(app, null)


//get rooms for user id
app.get('/api/user/:user/rooms/', function(req, res) {

  if(!req.session.passport) {
    return res.status(401).json()
  }

  if(!req.params.user) {
    return res.status(400).json({error: 'Missing user path parameter.'})
  }

  let userSplit = req.params.user.trim().split("~")
  let username = userSplit[0]
  let discriminator = userSplit[1]

  database.Room.find({
    "roles.members.username": username,
    "roles.members.discriminator": discriminator
  }, 'name', function(err, result) {

    if(err) return res.json({error: err})

    return res.json({result: result})
  })
})

app.use(history({}))

// Serve any static files
app.use(express.static(path.join(__dirname, './client/dist')))

// Handle Vue routing, return all unknown requests to Vue router
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './client/dist', 'index.html'))
})

app.listen(port, () => console.log(`Listening on port ${port}`))
