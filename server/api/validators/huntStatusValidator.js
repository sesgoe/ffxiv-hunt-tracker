const Joi = require('@hapi/joi')
const {errorFormatWithMessage} = require('./util/errorFormatWithMessage')

let huntStatusValidatorHelper = async function(huntStatus) {

    const validHuntStatus = Joi.string().min(1).alphanum().trim().required()

    let result = Joi.validate(huntStatus, validHuntStatus)
    if(result.error) {
        return errorFormatWithMessage("status path parameter must exist and be alphanumeric")
    }

    if(['found', 'dead'].indexOf(huntStatus) < 0) {
        return errorFormatWithMessage('status path parameter must be either "found" or "dead"')
    }

    return {error: false}
}

let huntStatusValidator = async function(req, res, next) {

    let result = await huntStatusValidatorHelper(req.params.status)
    if(result.error) {
        return res.status(400).json(result)
    }

    next()

}

module.exports = {
    huntStatusValidator: huntStatusValidator, 
    huntStatusValidatorHelper: huntStatusValidatorHelper
}
