const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const history = require('connect-history-api-fallback')
const moment = require('moment')

require('dotenv').config()

const database = require('./server/database')
const passport = require('./server/api/passport')
const discord = require('./server/api/discord')
const room = require('./server/api/room')

let databaseService = require('./server/services/databaseService')

const app = express()
const port = process.env.PORT || 5000

const EventEmitter = require('events')
class EventPassthrough extends EventEmitter {
  emitEvent(eventType, obj) {
    this.emit(eventType, obj)
  }
}

let eventHandler = new EventPassthrough()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// API calls
passport(app, null)
discord(app, null)
room(app, null)

//get room stream of events
app.get('/api/room/:roomName/stream', function(req, res) {

  function updateHandler(updateObject) {
    if(updateObject.roomName === req.params.roomName) {
      let update = {
        name: updateObject.huntName,
        status: updateObject.huntStatus,
        deathTimestamp: updateObject.huntDeathTimestamp
      }
      res.write(`data: ${JSON.stringify(update)}\n\n`)
    }
  }

  res.status(200).set({
    'connection': 'keep-alive',
    'cache-control': 'no-cache',
    'content-type': 'text/event-stream'
  })

  eventHandler.on('roomUpdate', updateHandler)

  res.on('close', () => {
    eventHandler.removeListener('roomUpdate', updateHandler)
    res.end()
  })

})

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

//create new room
app.post('/api/room/:roomName', function(req, res) {

  if(!req.session.passport) {
    console.log('401 unauthorized')
    return res.status(401).json()
  }

  if(!req.params.roomName) {
    console.log('missing roomName')
    res.status(400)
    return res.json({error: "The request is missing a roomName path parameter."})
  }

  var now = moment().valueOf()

  const room = new database.Room({
    name: req.params.roomName,
    createdAt: now,
    huntStatuses: [
        {
          name: "Erle",
          status: "unknown",
          deathTimestamp: now
        },
        {
          name: "Orcus",
          status: "unknown",
          deathTimestamp: now
        },
        {
          name: "Luminare",
          status: "unknown",
          deathTimestamp: now
        },
        {
          name: "Mahisha",
          status: "unknown",
          deathTimestamp: now
        },
        {
          name: "Vochstein",
          status: "unknown",
          deathTimestamp: now
        },
        {
          name: "Aqrabuamelu",
          status: "unknown",
          deathTimestamp: now
        },
        {
          name: "Funa Yurei",
          status: "unknown",
          deathTimestamp: now
        },
        {
          name: "Oni Yumemi",
          status: "unknown",
          deathTimestamp: now
        },
        {
          name: "Angada",
          status: "unknown",
          deathTimestamp: now
        },
        {
          name: "Gajasura",
          status: "unknown",
          deathTimestamp: now
        },
        {
          name: "Sum",
          status: "unknown",
          deathTimestamp: now
        },
        {
          name: "Girimekhala",
          status: "unknown",
          deathTimestamp: now
        }
    ],
    roles: [
        {
          name: "Creator",
          members: [
            {
              'userId': req.session.passport.user.discordId,
              'username': req.session.passport.user.discordUsername,
              'discriminator': req.session.passport.user.discordDiscriminator,
              'avatar': req.session.passport.user.discordAvatar
            }
          ]
        },
        {
          name: "Hunt Train Organizer",
          members: []
        },
        {
          name: "Scout",
          members: []
        },
        {
          name: "Member",
          members: []
        }
    ]
  })

  room.save(function(error, result) {
    if(error) return res.json({error: error})
    console.info(`Room name '${room.name}' created.`)

    return res.json({result: result})
  })

})

//add discord username+discrim to room as memberType
app.post('/api/room/:roomName/memberType/:memberType/user/:discordUsername', async function(req, res) {
  if(!req.session.passport) {
    return res.status(401).json()
  }

  if(!req.params.roomName || !req.params.memberType || !req.params.discordUsername) {
    return res.status(400).json({error: 'Missing either roomName, memberType, or discordUsername path parameter(s)'})
  }

  if(['organizer', 'scout', 'member'].indexOf(req.params.memberType) < 0) {
    return res.status(400).json({error: 'MemberType path parameter is invalid'})
  }

  let room = await databaseService.getRoomByName(req.params.roomName)
  let memberIndex = ['organizer', 'scout', 'member'].indexOf(req.params.memberType)
  let discordString = req.params.discordUsername.split('~')
  let username = discordString[0]
  let discriminator = discordString[1]

  //+1 because of roles[0] = owner
  room.roles[memberIndex+1].members.push(
    {
      userId: "0",
      username: username,
      discriminator: discriminator,
      avatar: "0"
    }
  )

  room.save(function(error, result) {
    if(error) return res.json({error: error})

    return res.json({result: result})
  })

})

app.delete('/api/room/:roomName/user/:discordUsername', async function(req, res) {
  if(!req.session.passport) {
    return res.status(401).json()
  }

  if(!req.params.roomName || !req.params.discordUsername) {
    return res.status(400).json({error: 'Missing either roomName or discordUsername path parameter(s)'})
  }

  let room = await databaseService.getRoomByName(req.params.roomName)
  let discordString = req.params.discordUsername.split('~')
  let username = discordString[0]
  let discriminator = discordString[1]

  for(let i=1; i<4; i++) {
    for(let j=0; j<room.roles[i].members.length; j++) {
      if(room.roles[i].members[j].username === username && room.roles[i].members[j].discriminator === discriminator) {
        room.roles[i].members.splice(j)
        break
      }
    }
  }

  room.save(function(error, result) {
    if(error) return res.json({error: error})

    return res.json({result: result})
  })

})

//update hunt status for room, hunt combo
app.put('/api/room/:roomName/hunt/:huntName/status/:status', function(req, res) {

  if(!req.session.passport) {
    return res.status(401).json()
  }

  if(!req.params.roomName || !req.params.huntName || !req.params.status) {
    return res.status(400).json({error: 'Missing either roomName, huntName, or status path parameter(s)'})
  }

  if(['found', 'dead'].indexOf(req.params.status) < 0) {
    return res.status(400).json({error: 'Status path parameter is invalid. Must be either found or dead.'})
  }

  let now = moment().valueOf()

  database.Room.updateOne({
    name: req.params.roomName,
    'huntStatuses.name': req.params.huntName
  },
  {
    '$set': {'huntStatuses.$.status': req.params.status, 'huntStatuses.$.deathTimestamp': now}
  },
  function(err, result) {
    if(err) return res.json({error: err})
    eventHandler.emitEvent('roomUpdate', {
      roomName: req.params.roomName,
      huntName: req.params.huntName,
      huntStatus: req.params.status,
      huntDeathTimestamp: now
    })
    return res.json(result)
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
