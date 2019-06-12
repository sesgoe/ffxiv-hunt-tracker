const {huntStatusValidator, huntStatusValidatorHelper} = require('./huntStatusValidator')

describe('huntStatusValidatorHelper', () => {

    test('empty string is an invalid hunt status', async () => {
        let result = await huntStatusValidatorHelper('')
        expect(result.error).toBe(true)
    })

    test('string with non-alphanumeric-character is invalid', async () => {
        let result = await huntStatusValidatorHelper('test!')
        expect(result.error).toBe(true)
    })

    test('string with all spaces is considered an invalid hunt status', async () => {
        let result = await huntStatusValidatorHelper('   ')
        expect(result.error).toBe(true)
    })

    test('null hunt status is invalid', async() => {
        let result = await huntStatusValidatorHelper(null)
        expect(result.error).toBe(true)
    })

    test('undefined hunt status is invalid', async() => {
        let result = await huntStatusValidatorHelper(undefined)
        expect(result.error).toBe(true)
    })

    test('valid string but is not one of the 2 allowed options', async () => {
        let result = await huntStatusValidatorHelper('test')
        expect(result.error).toBe(true)
    })

    test('"dead" is valid', async () => {
        let result = await huntStatusValidatorHelper('dead')
        expect(result.error).toBe(false)
    })

    test('"dead2" is invalid', async () => {
        let result = await huntStatusValidatorHelper('dead2')
        expect(result.error).toBe(true)
    })

    test('"found" is valid', async () => {
        let result = await huntStatusValidatorHelper('found')
        expect(result.error).toBe(false)
    })

})

describe('huntStatusValidator', () => {

    test('happy path for hunt status validator', async () => {
        const req = {
            params: {
                status: "dead"
            }
        }
        const res = jest.fn()
        const next = jest.fn()

        await huntStatusValidator(req, res, next)

        expect(next.mock.calls.length).toBe(1)
    })

    test('unhappy path for hunt status validator', async () => {
        const req = {
            params: {
                status: ""
            }
        }
        const res = jest.fn()
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        const next = jest.fn()

        await huntStatusValidator(req, res, next)

        expect(next.mock.calls.length).toBe(0)
        expect(res.status.mock.calls.length).toBe(1)
        expect(res.json.mock.calls.length).toBe(1)
    })

})
