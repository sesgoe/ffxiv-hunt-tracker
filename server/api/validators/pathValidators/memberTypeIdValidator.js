const Joi = require('@hapi/joi')
const {errorFormatWithMessage} = require('../util/errorFormatWithMessage')

let memberTypeIdValidatorHelper = async function(memberTypeId) {

    const validMemberTypeIdSchema = Joi.number().integer().min(1).max(4).required()

    let result = validMemberTypeIdSchema.validate(memberTypeId)
    if(result.error) {
        return errorFormatWithMessage("memberType path parameter must exist and be between 1 and 4 (Creator, Hunt Train Organizer, Scout, Member)")
    }

    return result.value
}

exports.memberTypeIdValidator = async function(req, res, next) {

    let result = await memberTypeIdValidatorHelper(req.params.memberTypeId)
    if(result.error) {
        return res.status(400).json(result)
    }

    next()

}
