const {roomIdValidator} = require('./roomIdValidator')

describe('roomIdValidator', () => {

    let res = jest.fn()
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    let next = jest.fn()
    let req = {
        params: {}
    }

    valueToTest = (value) => {
        req.params.roomId = value
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

    test('1 is a valid roomId', async () => {
        valueToTest(1)
        await roomIdValidator(req, res, next)
        expectGoodResult()
    })

    test('0 is an invalid roomId', async () => {
        valueToTest(0)
        await roomIdValidator(req, res, next)
        expectBadResult()
    })

    test('-1 is an invalid roomId', async () => {
        valueToTest(-1)
        await roomIdValidator(req, res, next)
        expectBadResult()
    })

    test('empty string is an invalid roomId', async () => {
        valueToTest('')
        await roomIdValidator(req, res, next)
        expectBadResult()
    })

    test('null is an invalid roomId', async () => {
        valueToTest(null)
        await roomIdValidator(req, res, next)
        expectBadResult()
    })

    test('undefined is an invalid roomId', async () => {
        valueToTest(undefined)
        await roomIdValidator(req, res, next)
        expectBadResult()
    })


})
