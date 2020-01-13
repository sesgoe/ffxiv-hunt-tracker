const {huntStatusValidator} = require('./huntStatusValidator')

describe('huntStatusValidator', () => {

    let res = jest.fn()
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    let next = jest.fn()
    let req = {
        params: {}
    }

    valueToTest = (value) => {
        req.params.status = value
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

    test('-1 is a valid huntStatus', async () => {
        valueToTest(-1)
        await huntStatusValidator(req, res, next)
        expectGoodResult()
    })

    test('0 is a valid huntStatus', async () => {
        valueToTest(0)
        await huntStatusValidator(req, res, next)
        expectGoodResult()
    })

    test('1 is a valid huntStatus', async () => {
        valueToTest(1)
        await huntStatusValidator(req, res, next)
        expectGoodResult()
    })

    test('2 is an invalid huntStatus', async () => {
        valueToTest(2)
        await huntStatusValidator(req, res, next)
        expectBadResult()
    })

    test('-2 is an invalid huntStatus', async () => {
        valueToTest(-2)
        await huntStatusValidator(req, res, next)
        expectBadResult()
    })

    test('empty string is an invalid huntStatus', async () => {
        valueToTest('')
        await huntStatusValidator(req, res, next)
        expectBadResult()
    })

    test('null is an invalid huntStatus', async () => {
        valueToTest(null)
        await huntStatusValidator(req, res, next)
        expectBadResult()
    })

    test('undefined is an invalid huntStatus', async () => {
        valueToTest(undefined)
        await huntStatusValidator(req, res, next)
        expectBadResult()
    })


})
