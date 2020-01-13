const Joi = require('@hapi/joi')
const {errorFormatWithMessage} = require('../util/errorFormatWithMessage')

let roomNameValidatorHelper = async function(roomName) {

    const validRoomNameSchema = Joi.string().alphanum().min(1).trim().required()

    let result = validRoomNameSchema.validate(roomName)
    if(result.error) {
        return errorFormatWithMessage("roomName body parameter must exist and be alphanumeric and nonempty")
    }

    return result.value
}

exports.roomNameValidator = async function(req, res, next) {

    let result = await roomNameValidatorHelper(req.body.name)
    if(result.error) {
        return res.status(400).json(result)
    }

    req.body.name = result
    next()

}
