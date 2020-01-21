const express = require('express')
const router = express.Router()
const {isAuthenticated} = require('./validators/pathValidators/authenticationValidator')
const databaseService = require('../services/monsterService')

module.exports = async function(server, config) {

    router.get('/api/user/:user/rooms/',
    [
        isAuthenticated
    ],
    async function(req, res) {

        let rooms = await databaseService.getRoomsByDiscordUser(req.session.passport.user) //needs to be based on passport for security reasons
        console.log(rooms)

        res.json(rooms)
    })

    server.use(router)
}
