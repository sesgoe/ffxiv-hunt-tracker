const {huntIdValidator} = require('./huntIdValidator')

describe('huntIdValidator', () => {

    let res = jest.fn()
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    let next = jest.fn()
    let req = {
        params: {}
    }

    valueToTest = (value) => {
        req.params.huntId = value
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

    test('0 is a valid huntId', async () => {
        valueToTest(0)
        await huntIdValidator(req, res, next)
        expectGoodResult()
    })

    test('1 is a valid huntId', async () => {
        valueToTest(1)
        await huntIdValidator(req, res, next)
        expectGoodResult()
    })

    test('-1 is an invalid huntId', async () => {
        valueToTest(-1)
        await huntIdValidator(req, res, next)
        expectBadResult()
    })

    test('empty string is an invalid huntId', async () => {
        valueToTest('')
        await huntIdValidator(req, res, next)
        expectBadResult()
    })

    test('null is an invalid huntId', async () => {
        valueToTest(null)
        await huntIdValidator(req, res, next)
        expectBadResult()
    })

    test('undefined is an invalid huntId', async () => {
        valueToTest(undefined)
        await huntIdValidator(req, res, next)
        expectBadResult()
    })


})
