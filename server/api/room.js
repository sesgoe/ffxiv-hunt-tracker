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
        [
            isAuthenticated,
            roomNameValidator
        ],
        async function(req, res) {

            let room = await databaseService.getRoomByName(req.params.roomName)

            if(room.error) {
                return res.json({error: room.error})
            }

            return res.json({result: room})
    })

    //get all rooms for someone logged in
    router.get(
        '/api/rooms',
        [
            isAuthenticated
        ],
        async function(req, res) {

            let rooms = await databaseService.getRoomsByDiscordUser(req.session.passport.user)

            if(rooms.error) {
                return res.json({error: rooms.error})
            }

            return res.json({result: rooms})
    })

    //create new room
    router.post(
        '/api/room/:roomName',
        [
            isAuthenticated,
            roomNameValidator
        ],
        async function(req, res) {

            let createdRoom = await databaseService.createRoom(req.params.roomName, req.session.passport.user)

            if(createdRoom.constraint) {
                if(createdRoom.constraint.includes('rooms_name_key')) {
                    return res.status(400).json({error: "A room with that name already exists. Please pick another name."})
                }
                return res.status(500).json({error: "The room was unable to be created. Please try again later."})
            }

            return res.json({result: createdRoom})

      })

    //get stream of room events
    router.get(
        '/api/room/:roomName/stream',
        [
            isAuthenticated,
            roomNameValidator
        ],
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

      //add discord username+discrim to room as memberType
      router.post(
        '/api/room/:roomName/memberType/:memberType/user/:discordUsername',
        [
            isAuthenticated,
            roomNameValidator,
            memberTypeValidator,
            discordUsernameValidator
        ],
        async function(req, res) {

            let room = await databaseService.getRoomByName(req.params.roomName)
            let discordString = req.params.discordUsername.split('~')
            let username = discordString[0]
            let discriminator = discordString[1]
            let discordUser = await databaseService.getDiscordUserByDiscordUsernameAndDiscordDiscriminator(username, discriminator)


      })

      router.delete(
        '/api/room/:roomName/user/:discordUsername',
        [
            isAuthenticated,
            roomNameValidator,
            discordUsernameValidator
        ],
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
    //TODO: Update to use huntId instead of name
    router.put(
    '/api/room/:roomName/hunt/:huntName/status/:status',
    [
        isAuthenticated,
        roomNameValidator,
        huntNameValidator,
        huntStatusValidator
    ],
    function(req, res) {

        const result = await database.updateMonsterStatusForRoom(1, 1, req.params.status)

        if(!result) {
            return res.status(500).json({error: "Unable to update monster status. Please try again."})
        }

        return res.json({result: "Successfully updated monster statuses."})

    })

    server.use(router)

}
