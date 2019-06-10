const Joi = require('@hapi/joi')

let roomNameValidator = async function(req, res, next) {

    const validRoomName = Joi.string().min(1).alphanum().required()
    let result = Joi.validate(req.params.roomName, validRoomName)
    if(result.error) {
        return res.status(400).json({error: true, message: "roomName path parameter must exist and be alphanumeric."})
    }

    next()

}

module.exports = {
    roomNameValidator: roomNameValidator
}
