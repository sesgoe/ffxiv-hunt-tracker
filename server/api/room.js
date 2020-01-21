const express = require('express')
const router = express.Router()
const {isAuthenticated} = require('./validators/pathValidators/authenticationValidator')
const {roomIdValidator} = require('./validators/pathValidators/roomIdValidator')
const {memberTypeIdValidator} = require('./validators/pathValidators/memberTypeIdValidator')
const {discordUserValidator} = require('./validators/bodyValidators/discordUserValidator')
const {huntIdValidator} = require('./validators/pathValidators/huntIdValidator')
const {huntStatusValidator} = require('./validators/pathValidators/huntStatusValidator')
const {roomNameValidator} = require('./validators/bodyValidators/roomNameValidator')

let monsterService = require('../services/monsterService')
let roomService = require('../services/roomService')
let userService = require('../services/userService')

const EventEmitter = require('events')
class EventPassthrough extends EventEmitter {
  emitEvent(eventType, obj) {
    this.emit(eventType, obj)
  }
}

let eventHandler = new EventPassthrough()

module.exports = async function(server, config) {

    //get room by roomId
    router.get(
        '/api/room/:roomId',
        [
            isAuthenticated,
            roomIdValidator
        ],
        async function(req, res) {

            let roomId = req.params.roomId

            let room = await roomService.getRoomById(roomId)

            if(room.error) {
                return res.json({error: room.error})
            }

            return res.json({result: room})
    })

    //get all rooms for someone logged in
    router.get(
        '/api/room',
        [
            isAuthenticated
        ],
        async function(req, res) {

            let discordUser = req.session.passport.user

            let rooms = await roomService.getRoomsByDiscordUser(discordUser)

            if(rooms.error) {
                return res.json({error: rooms.error})
            }

            return res.json({result: rooms})
    })

    //create new room
    router.post(
        '/api/room',
        [
            //isAuthenticated,
            roomNameValidator
        ],
        async function(req, res) {

            let roomName = req.body.name
            //let discordUser = req.session.passport.user
            let discordUser = {
                id: '109065059057041408',
                username: 'Sestopher',
                discriminator: '2430',
                avatar: '496a6c3af37433b8966d7fcc7752d853'
            }

            let createdRoom = await roomService.createRoom(roomName, discordUser)

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
        '/api/room/:roomId/stream',
        [
            isAuthenticated,
            roomIdValidator
        ],
        async function(req, res) {

            //TODO: how to refactor this better 0_0
            function updateHandler(updateObject) {
                if(updateObject.roomId === req.params.roomId) {
                    let update = {
                        id: updateObject.huntId,
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

    //add discord username+discrim to room as memberTypeId
    router.post(
        '/api/room/:roomId/memberType/:memberTypeId/user',
        [
           // isAuthenticated,
            roomIdValidator,
            memberTypeIdValidator,
            discordUserValidator
        ],
        async function(req, res) {

            let roomId = req.params.roomId
            let roleId = req.params.memberTypeId
            let discordUser = req.body.discordUser

            let result = userService.addUserToRoomIdAsRoleId(discordUser, roomId, roleId)

            if(!result) {
                res.json({error: "Unable to add user to room. Please try again."})
            }

            res.json({result: result})

    })

    //delete discord username+discrim from room
    router.delete(
        '/api/room/:roomId/user',
        [
            isAuthenticated,
            roomIdValidator,
            discordUserValidator
        ],
        async function(req, res) {

            let roomId = req.params.roomId
            let discordUser = req.params.discordUser

            let room = await roomService.getRoomById(roomId)


    })

    //update hunt status for room, hunt combo
    router.put(
        '/api/room/:roomId/hunt/:huntId/status/:status',
        [
            isAuthenticated,
            roomIdValidator,
            huntIdValidator,
            huntStatusValidator
        ],
        async function(req, res) {

            let roomId = req.params.roomId
            let monsterId = req.params.huntId
            let newStatus = req.params.status

            const result = await monsterService.updateMonsterStatus(roomId, monsterId, newStatus)

            if(!result) {
                return res.status(500).json({error: "Unable to update monster status. Please try again."})
            }

            return res.json({result: "Successfully updated monster statuses."})

    })

    //------------
    server.use(router)

}
