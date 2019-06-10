const express = require('express')
const router = express.Router()
const {isAuthenticated} = require('./validators/authenticationValidator')
const {roomNameValidator} = require('./validators/roomNameValidator')

let databaseService = require('../services/databaseService')


module.exports = async function(server, config) {
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

    server.use(router)

}
