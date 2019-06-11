const Joi = require('@hapi/joi')
const {errorFormatWithMessage} = require('./util/errorFormatWithMessage')

let roomNameValidatorHelper = async function(roomName) {

    const validRoomName = Joi.string().min(1).alphanum().trim().required()

    let result = Joi.validate(roomName, validRoomName)
    if(result.error) {
        return errorFormatWithMessage("roomName path parameter must exist and be alphanumeric.")
    }

    return({error: false})
}

let roomNameValidator = async function(req, res, next) {

    let result = await roomNameValidatorHelper(req.params.roomName)
    if(result.error) {
        return res.status(400).json(result)
    }

    next()

}

module.exports = {
    roomNameValidator: roomNameValidator,
    roomNameValidatorHelper: roomNameValidatorHelper
}
