const Joi = require('@hapi/joi')
const {errorFormatWithMessage} = require('../util/errorFormatWithMessage')

let roomIdValidatorHelper = async function(roomId) {

    const validRoomIdSchema = Joi.number().integer().min(1).required()

    let result = validRoomIdSchema.validate(roomId)
    if(result.error) {
        return errorFormatWithMessage("roomId path parameter must exist and be a positive integer")
    }

    return result.value
}

exports.roomIdValidator = async function(req, res, next) {

    let result = await roomIdValidatorHelper(req.params.roomId)
    if(result.error) {
        return res.status(400).json(result)
    }

    next()

}
