const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const history = require('connect-history-api-fallback')

require('dotenv').config()

const passport = require('./server/api/passport')
const discord = require('./server/api/discord')
const room = require('./server/api/room')
const user = require('./server/api/user')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// API calls
passport(app, null)
discord(app, null)
room(app, null)
user(app, null)

app.use(history({}))

// Serve any static files
app.use(express.static(path.join(__dirname, './client/dist')))

// Handle Vue routing, return all unknown requests to Vue router
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './client/dist', 'index.html'))
})

app.listen(port, () => console.log(`Listening on port ${port}`))
