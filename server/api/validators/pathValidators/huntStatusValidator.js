const Joi = require('@hapi/joi')
const {errorFormatWithMessage} = require('../util/errorFormatWithMessage')

let huntStatusValidatorHelper = async function(huntStatus) {

    const validHuntStatusSchema = Joi.number().integer().min(-1).max(1).required()

    let result = validHuntStatusSchema.validate(huntStatus)
    if(result.error) {
        return errorFormatWithMessage("huntStatus path parameter must exist and be -1, 0, or 1 (dead, unknown, alive)")
    }

    return result.value
}

exports.huntStatusValidator = async function(req, res, next) {

    let result = await huntStatusValidatorHelper(req.params.status)
    if(result.error) {
        return res.status(400).json(result)
    }

    next()

}
