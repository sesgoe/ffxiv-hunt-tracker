const express = require('express')
const router = express.Router()
const {isAuthenticated} = require('./validators/pathValidators/authenticationValidator')

module.exports = async function(server, config) {

    router.get('/api/discord/profile',
    [
      isAuthenticated
    ],
    function(req, res) {
        return res.json({user: req.session.passport.user})
      })

    server.use(router)
}
