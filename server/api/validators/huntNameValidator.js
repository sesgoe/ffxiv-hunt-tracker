const Joi = require('@hapi/joi')
const {errorFormatWithMessage} = require('./util/errorFormatWithMessage')

let huntNameValidatorHelper = async function(huntName) {

    const validHuntName = Joi.string().min(1).alphanum().trim().required()

    let result = Joi.validate(huntName, validHuntName)
    if(result.error) {
        return errorFormatWithMessage("huntName path parameter must exist and be alphanumeric")
    }

    if(['Erle', 'Orcus', 'Luminare', 'Mahisha', 'Vochstein', 'Aqrabuamelu', 'Funa Yurei', 'Oni Yumemi', 'Angada', 'Gajasura', 'Sum', 'Girimekhala'].indexOf(huntName) < 0) {
        return errorFormatWithMessage("huntName path parameter must be a valid hunt name")
    }

    return {error: false}
}

let huntNameValidator = async function(req, res, next) {

    let result = await huntNameValidatorHelper(req.params.huntName)
    if(result.error) {
        return res.status(400).json(result)
    }

    next()

}

module.exports = {
    huntNameValidator: huntNameValidator
}
