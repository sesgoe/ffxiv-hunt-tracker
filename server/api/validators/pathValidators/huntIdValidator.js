const Joi = require('@hapi/joi')
const {errorFormatWithMessage} = require('../util/errorFormatWithMessage')

let huntIdValidatorHelper = async function(huntId) {

    const validHuntIdSchema = Joi.number().integer().min(0).required()

    let result = validHuntIdSchema.validate(huntId)
    if(result.error) {
        return errorFormatWithMessage("huntId path parameter must exist and be a positive integer")
    }

    return result.value
}

exports.huntIdValidator = async function(req, res, next) {

    let result = await huntIdValidatorHelper(req.params.huntId)
    if(result.error) {
        return res.status(400).json(result)
    }

    next()

}
