const {discordUserValidator} = require('./discordUserValidator')

describe('discordUserValidator', () => {

    let res = jest.fn()
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    let next = jest.fn()
    let req = {
        body: {
            discordUser: {}
        }
    }

    valueToTest = (value) => {
        req.body.discordUser = value
    }

    expectGoodResult = () => {
        expect(next.mock.calls.length).toBe(1)
    }

    expectBadResult = () => {
        expect(next.mock.calls.length).toBe(0)
        expect(res.status.mock.calls.length).toBe(1)
        expect(res.json.mock.calls.length).toBe(1)
    }

    beforeEach(() => {
        res = jest.fn()
        res.status = jest.fn().mockReturnValue(res)
        res.json = jest.fn().mockReturnValue(res)
        next = jest.fn()
    })

    test('{username, 1234} is a valid discordUser', async () => {
        valueToTest(
            {
                username: 'username',
                discriminator: 1234
            }
        )
        await discordUserValidator(req, res, next)
        expectGoodResult()
    })

    test('{empty string, 1234} is an invalid discordUser', async () => {
        valueToTest(
            {
                username: '',
                discriminator: 1234
            }
        )
        await discordUserValidator(req, res, next)
        expectBadResult()
    })

    test('username with all spaces is an invalid discordUser', async () => {
        valueToTest(
            {
                username: '     ',
                discriminator: 1234
            }
        )
        await discordUserValidator(req, res, next)
        expectBadResult()
    })

    test('{username, -1234} is an invalid discordUser', async () => {
        valueToTest(
            {
                username: 'username',
                discriminator: -1234
            }
        )
        await discordUserValidator(req, res, next)
        expectBadResult()
    })

    test('no username is an invalid discordUser', async () => {
        valueToTest(
            {
                discriminator: 1234
            }
        )
        await discordUserValidator(req, res, next)
        expectBadResult()
    })

    test('no discriminator is an invalid discordUser', async () => {
        valueToTest(
            {
                username: "username"
            }
        )
        await discordUserValidator(req, res, next)
        expectBadResult()
    })

    test('empty object is an invalid discordUser', async () => {
        valueToTest({})
        await discordUserValidator(req, res, next)
        expectBadResult()
    })

    test('null is an invalid discordUser', async () => {
        valueToTest(null)
        await discordUserValidator(req, res, next)
        expectBadResult()
    })

    test('undefined is an invalid discordUser', async () => {
        valueToTest(undefined)
        await discordUserValidator(req, res, next)
        expectBadResult()
    })


})
