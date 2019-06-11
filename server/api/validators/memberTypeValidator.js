const Joi = require('@hapi/joi')
const {errorFormatWithMessage} = require('./util/errorFormatWithMessage')

let memberTypeValidatorHelper = async function(memberType) {

    const validMemberType = Joi.string().min(1).alphanum().trim().required()

    let result = Joi.validate(memberType, validMemberType)
    if(result.error) {
        return errorFormatWithMessage("memberType path parameter must exist and be alphanumeric")
    }

    if(['organizer', 'scout', 'member'].indexOf(memberType) < 0) {
        return errorFormatWithMessage('memberType path parameter must be either "organizer", "scout", or "member"')
    }

    return({error: false})
}

let memberTypeValidator = async function(req, res, next) {

    let result = await memberTypeValidatorHelper(req.params.memberType)
    if(result.error) {
        return res.status(400).json(result)
    }

    next()

}

module.exports = {
    memberTypeValidator: memberTypeValidator,
    memberTypeValidatorHelper: memberTypeValidatorHelper
}
