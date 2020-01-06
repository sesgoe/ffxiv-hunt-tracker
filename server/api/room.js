const express = require('express')
const moment = require('moment')
const router = express.Router()
const {isAuthenticated} = require('./validators/authenticationValidator')
const {roomNameValidator} = require('./validators/roomNameValidator')
const {memberTypeValidator} = require('./validators/memberTypeValidator')
const {discordUsernameValidator} = require('./validators/discordUsernameValidator')
const {huntNameValidator} = require('./validators/huntNameValidator')
const {huntStatusValidator} = require('./validators/huntStatusValidator')

let databaseService = require('../services/databaseService')
let database = require('../database')

const EventEmitter = require('events')
class EventPassthrough extends EventEmitter {
  emitEvent(eventType, obj) {
    this.emit(eventType, obj)
  }
}

let eventHandler = new EventPassthrough()

module.exports = async function(server, config) {

    //get room by roomName
    router.get(
        '/api/room/:roomName',
        [isAuthenticated, roomNameValidator],
        async function(req, res) {

            let room = await databaseService.getRoomByName(req.params.roomName)

            if(room.error) {
                return res.json({error: room.error})
            }

            return res.json({result: room})
    })

    //get stream of room events
    router.get(
        '/api/room/:roomName/stream',
        [isAuthenticated, roomNameValidator],
        async function(req, res) {

            //TODO: how to refactor this better 0_0
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

      //create new room
      router.post(
        '/api/room/:roomName',
        [isAuthenticated, roomNameValidator],
        async function(req, res) {

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
      router.post(
        '/api/room/:roomName/memberType/:memberType/user/:discordUsername',
        [isAuthenticated, roomNameValidator, memberTypeValidator, discordUsernameValidator],
        async function(req, res) {

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

      router.delete(
        '/api/room/:roomName/user/:discordUsername',
        [isAuthenticated, roomNameValidator, discordUsernameValidator],
        async function(req, res) {

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
      router.put(
          '/api/room/:roomName/hunt/:huntName/status/:status',
          [isAuthenticated, roomNameValidator, huntNameValidator, huntStatusValidator],
          function(req, res) {

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

    server.use(router)

}
