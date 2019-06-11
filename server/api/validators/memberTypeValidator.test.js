const {memberTypeValidator, memberTypeValidatorHelper} = require('./memberTypeValidator')

describe('memberTypeValidatorHelper', () => {

    test('empty string is an invalid member type', async () => {
        let result = await memberTypeValidatorHelper('')
        expect(result.error).toBe(true)
    })

    test('string with non-alphanumeric-character is invalid', async () => {
        let result = await memberTypeValidatorHelper('test!')
        expect(result.error).toBe(true)
    })

    test('string with all spaces is considered an invalid memberType', async () => {
        let result = await memberTypeValidatorHelper('   ')
        expect(result.error).toBe(true)
    })
    
    test('null memberType is invalid', async() => {
        let result = await memberTypeValidatorHelper(null)
        expect(result.error).toBe(true)
    })
    
    test('undefined memberType is invalid', async() => {
        let result = await memberTypeValidatorHelper(undefined)
        expect(result.error).toBe(true)
    })

    test('valid string but is not one of the 3 allowed options', async () => {
        let result = await memberTypeValidatorHelper('test')
        expect(result.error).toBe(true)
    })

    test('"organizer" is valid', async () => {
        let result = await memberTypeValidatorHelper('organizer')
        expect(result.error).toBe(false)
    })

    test('"scout" is valid', async () => {
        let result = await memberTypeValidatorHelper('scout')
        expect(result.error).toBe(false)
    })

    test('"member" is valid', async () => {
        let result = await memberTypeValidatorHelper('member')
        expect(result.error).toBe(false)
    })

})

describe('memberTypeValidator', () => {

    test('happy path for member type validator', async () => {
        const req = {
            params: {
                memberType: "organizer"
            }
        }
        const res = jest.fn()
        const next = jest.fn()

        await memberTypeValidator(req, res, next)

        expect(next.mock.calls.length).toBe(1)
    })

    test('unhappy path for member type validator', async () => {
        const req = {
            params: {
                memberType: ""
            }
        }
        const res = jest.fn()
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        const next = jest.fn()

        await memberTypeValidator(req, res, next)

        expect(next.mock.calls.length).toBe(0)
        expect(res.status.mock.calls.length).toBe(1)
        expect(res.json.mock.calls.length).toBe(1)
    })

})