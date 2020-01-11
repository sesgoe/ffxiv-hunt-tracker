const express = require('express')
const router = express.Router()
const {isAuthenticated} = require('./validators/authenticationValidator')
const databaseService = require('../services/databaseService')

module.exports = async function(server, config) {

    router.get('/api/user/:user/rooms/',
    [
        isAuthenticated
    ],
    async function(req, res) {

        let rooms = await databaseService.getRoomsByDiscordUser(req.session.passport.user)
        console.log(rooms)

        res.json(rooms)
    })

    server.use(router)
}
