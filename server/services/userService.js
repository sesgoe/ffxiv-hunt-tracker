const database = require('../database')
const uuidv4 = require('uuid/v4')

exports.getDiscordUser = async (discordUser) => {
    let result = await database.getUserByUsernameAndDiscriminator(discordUser.username, discordUser.discriminator)
    if(result) {
        return convertDbDiscordUserToDiscordUser(result)
    }
    return result
}

exports.upsertUser = async(discordUser) => {
    return convertDbDiscordUserToDiscordUser(
        await database.upsertUser(discordUser)
    )
}

exports.upsertNotLoggedInUser = async(discordUser) => {
    discordUser.id = uuidv4()
    discordUser.avatar = ''
    return exports.upsertUser(discordUser)
}

exports.addUserToRoomIdAsRoleId = async(discordUser, roomId, roleId) => {

    let dbDiscordUser = await exports.getDiscordUser(discordUser)
    if(!dbDiscordUser) {
        dbDiscordUser = await exports.upsertNotLoggedInUser(discordUser)
    }

    return await database.addUserToRoomIdAsRoleId(dbDiscordUser, roomId, roleId)
}

convertDbDiscordUserToDiscordUser = async(dbDiscordUser) => {
    console.log("received user: ", dbDiscordUser)
    let discordUser = {
        id: dbDiscordUser.discordid,
        username: dbDiscordUser.discordusername,
        discriminator: dbDiscordUser.discorddiscriminator,
        avatar: dbDiscordUser.discordavatar
    }
    return discordUser
}
