const Joi = require('@hapi/joi')
const {errorFormatWithMessage} = require('./util/errorFormatWithMessage')

let discordUsernameValidatorHelper = async function(discordUsername) {

    const validDiscordUsername = Joi.string().min(1).alphanum().trim().required()

    let result = Joi.validate(discordUsername, validDiscordUsername)
    if(result.error) {
        return errorFormatWithMessage("roomName path parameter must exist and be alphanumeric")
    }

    if(discordUsername.indexOf('~') < 0) {
        return errorFormatWithMessage("missing discord discriminator character '~'")
    }

    let usernameSplitArray = discordUsername.split('~')
    if(usernameSplitArray.length != 2) {
        return errorFormatWithMessage("missing either discord username or discriminator")
    }

    let discordUsername = usernameSplitArray[0]
    let discordDiscriminator = usernameSplitArray[1]

    const validUsernameString = Joi.string().min(1).alphanum().trim().required()
    const validDiscriminator = Joi.string().length(4).alphanum().trim().required()

    let testDiscordUsername = Joi.validate(discordUsername, validUsernameString)
    let testDiscordDiscriminator = Joi.validate(discordDiscriminator, validDiscriminator)

    if(testDiscordUsername.error) {
        return errorFormatWithMessage("discordUsername must exist and consist of only alphanumeric characters")
    }
    if(testDiscordDiscriminator.error) {
        return errorFormatWithMessage("discordDiscriminator must exist, be of length 4, and consist only of alphanumeric characters")
    }

    return {error: false}

}

let discordUsernameValidator = async function(req, res, next) {

    let result = await discordUsernameValidatorHelper(req.params.discordUsername)

    if(result.error) {
        return res.status(400).json(result)
    }

    next()

}

module.exports = {
    discordUsernameValidator: discordUsernameValidator
}
