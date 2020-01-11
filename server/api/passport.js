const express = require('express')
const router = express.Router()
const session = require('express-session')

const passport = require('passport')
const DiscordStrategy = require('passport-discord').Strategy
const MongoDBStore = require('connect-mongodb-session')(session)

const databaseService = require('../services/databaseService')

module.exports = function (server, config) {

    var store = new MongoDBStore({
        uri: process.env.MONGO_URL,
        collection: process.env.MONGO_SESSION_COLLECTION
    })

    store.on('error', function(error) {
        console.error(error)
    })

    server.use(require('express-session')({
        secret: process.env.EXPRESS_SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60  //1 hour session for testing TODO: Fix later
        },
        store: store,
        resave: false,
        saveUninitialized: false
    }))

    passport.use(new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        scope: ['identify']
        }, async function(accessToken, refreshToken, profile, callback) {
        var user = {
            discordId: profile.id,
            discordUsername: profile.username,
            discordDiscriminator: profile.discriminator,
            discordAvatar: profile.avatar
        }
        let result = await databaseService.updateUser(user)
        if(!result) {
            console.log("Error with user saving to database!")
        }
        return callback(null, user)
    }))

    passport.serializeUser(function(user, done) {
        done(null, user)
    })

    passport.deserializeUser(function(user, done) {
        done(null, user)
    })

    server.use(passport.initialize())
    server.use(passport.session())

    router.get('/api/discord/auth', passport.authenticate('discord'))
    router.get('/api/discord/auth/callback', passport.authenticate('discord', {
        failureRedirect: '/'
    }), function(req, res) {
        res.redirect('/')
    })

    server.use(router)
}
