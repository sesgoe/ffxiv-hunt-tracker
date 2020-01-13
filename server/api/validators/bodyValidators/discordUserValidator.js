const Joi = require('@hapi/joi')
const {errorFormatWithMessage} = require('../util/errorFormatWithMessage')

let discordUserValidatorHelper = async function(discordUser) {

    const validDiscordUserSchema = Joi.object(
        {
            username: Joi.string().alphanum().min(1).trim().required(),
            discriminator: Joi.number().integer().min(0).required()
        }
    ).required()

    let result = validDiscordUserSchema.validate(discordUser)
    if(result.error) {
        return errorFormatWithMessage("discordUser body parameter must exist have valid username and discriminator properties")
    }

    return result.value
}

exports.discordUserValidator = async function(req, res, next) {

    let result = await discordUserValidatorHelper(req.body.discordUser)
    if(result.error) {
        return res.status(400).json(result)
    }

    req.body.discordUser = result
    next()

}
