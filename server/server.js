const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const cors = require('cors');

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

const path = require('path');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');

const database = require('./database');

const moment = require('moment');

const app = express();
const port = process.env.PORT || 5000;

const EventEmitter = require('events')
class EventPassthrough extends EventEmitter {
  emitEvent(eventType, obj) {
    this.emit(eventType, obj);
  }
}

let eventHandler = new EventPassthrough()

var store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: process.env.MONGO_SESSION_COLLECTION
});

store.on('error', function(error) {
  console.log(error);
});

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify']
}, function(accessToken, refreshToken, profile, cb) {
  var user = {
    discordId: profile.id,
    discordUsername: profile.username,
    discordDiscriminator: profile.discriminator,
    discordAvatar: profile.avatar
  };
  return cb(null, user);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: process.env.EXPRESS_SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60  //1 hour session for testing TODO: Fix later
  },
  store: store,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

// API calls

app.get('/api/discord/auth', passport.authenticate('discord'));
app.get('/api/discord/auth/callback', passport.authenticate('discord', {
  failureRedirect: '/'
}), function(req, res) {
  res.redirect('/')
});

//get discord profile
app.get('/api/discord/profile', function(req, res) {

  if(!req.session.passport) {
    return res.status(401).json()
  }

  return res.json({user: req.session.passport.user});
});

//get room by roomName
app.get('/api/room/:roomName', function(req, res) {
  database.Room.findOne({name: req.params.roomName}, function(err, result) {
    if(err) return res.json({error: error})

    return res.json({result: result})
  })
});

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
});

//create new room
app.post('/api/room/:roomName', function(req, res) {

  if(!req.session.passport) {
    console.log('401 unauthorized')
    return res.status(401).json();
  }

  if(!req.params.roomName) {
    console.log('missing roomName')
    res.status(400);
    return res.json({error: "The request is missing a roomName path parameter."});
  }

  var now = moment().valueOf();

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
  });

  room.save(function(error, result) {
    if(error) return res.json({error: error})
    console.info(`Room name '${room.name}' created.`);

    return res.json({result: result})
  })
});

app.post('/api/room/:roomName/memberType/:memberType/user/:discordUsername', function(req, res) {
  if(!req.session.passport) {
    return res.status(401).json();
  }

  if(!req.params.roomName || !req.params.memberType || !req.params.discordUsername) {
    return res.status(400).json({error: 'Missing either roomName, memberType, or discordUsername path parameter(s)'})
  }

  if(['hto', 'scout', 'member'].indexOf(req.params.memberType) < 0) {
    return res.status(400).json({error: 'MemberType path parameter is invalid'})
  }

  console.log(req.params.discordUsername)

})

//update hunt status for room, hunt combo
app.put('/api/room/:roomName/hunt/:huntName/status/:status', function(req, res) {

  if(!req.session.passport) {
    return res.status(401).json();
  }

  if(!req.params.roomName || !req.params.huntName || !req.params.status) {
    return res.status(400).json({error: 'Missing either roomName, huntName, or status path parameter(s)'})
  }

  if(['found', 'dead', 'respawning', 'unknown'].indexOf(req.params.status) < 0) {
    return res.status(400).json({error: 'Status path parameter is invalid'})
  }

  let now = moment().valueOf()

  if(req.params.status === 'respawning') { //don't want to set timestamp if respawning
    database.Room.updateOne({
      name: req.params.roomName,
      'huntStatuses.name': req.params.huntName
    },
    {
      '$set': {'huntStatuses.$.status': req.params.status}
    },
    function(err, result) {
      if(err) return res.json({error: err})
      eventHandler.emitEvent('roomUpdate', {
        roomName: req.params.roomName,
        huntName: req.params.huntName,
        huntStatus: req.params.status
      });
      return res.json(result)
    })
  } else {
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
      });
      return res.json(result)
    })
  }
});

app.use(history({}));

// if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Handle Vue routing, return all requests to Vue app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
// }

app.listen(port, () => console.log(`Listening on port ${port}`));
