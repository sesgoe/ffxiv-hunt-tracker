const {roomNameValidator, roomNameValidatorHelper} = require('./roomNameValidator')

describe('roomNameValidatorHelper', () => {
    test('empty string is an invalid room name', async () => {
        let result = await roomNameValidatorHelper('')
        expect(result.error).toBe(true)
    })
    
    test('string with non-alphanumeric character is an invalid room name', async () => {
        let result = await roomNameValidatorHelper('test!')
        expect(result.error).toBe(true)
    })
    
    test('string with all spaces is considered an invalid room name', async () => {
        let result = await roomNameValidatorHelper('   ')
        expect(result.error).toBe(true)
    })
    
    test('null room name is invalid', async() => {
        let result = await roomNameValidatorHelper(null)
        expect(result.error).toBe(true)
    })
    
    test('undefined room name is invalid', async() => {
        let result = await roomNameValidatorHelper(undefined)
        expect(result.error).toBe(true)
    })
    
    test('valid room name is valid', async () => {
        let result = await roomNameValidatorHelper('validRoomName')
        expect(result.error).toBe(false)
    })
})

describe('roomNameValidator', () => {
    test('happy path for room name validator', async () => {
        const req = {
            params: {
                roomName: "validRoomName"
            }
        }
        const res = jest.fn()
        const next = jest.fn()

        await roomNameValidator(req, res, next)

        expect(next.mock.calls.length).toBe(1)
    })

    test('unhappy path for room name validator', async () => {
        const req = {
            params: {
                roomName: ""
            }
        }
        const res = jest.fn()
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        const next = jest.fn()

        await roomNameValidator(req, res, next)

        expect(next.mock.calls.length).toBe(0)
        expect(res.status.mock.calls.length).toBe(1)
        expect(res.json.mock.calls.length).toBe(1)
    })
})