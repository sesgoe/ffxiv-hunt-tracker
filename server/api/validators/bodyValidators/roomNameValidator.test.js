const {roomNameValidator} = require('./roomNameValidator')

describe('roomNameValidator', () => {

    let res = jest.fn()
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    let next = jest.fn()
    let req = {
        body: {}
    }

    valueToTest = (value) => {
        req.body.name = value
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

    test('roomName is a valid roomName', async () => {
        valueToTest('roomName')
        await roomNameValidator(req, res, next)
        expectGoodResult()
    })

    test('roomName123 is a valid roomName', async () => {
        valueToTest('roomName123')
        await roomNameValidator(req, res, next)
        expectGoodResult()
    })

    test('1 is a valid roomName', async () => {
        valueToTest('1')
        await roomNameValidator(req, res, next)
        expectGoodResult()
    })

    test('padded spaces string is a valid roomName and gets trimmed', async () => {
        valueToTest('    a    ')
        await roomNameValidator(req, res, next)
        expectGoodResult()
        expect(req.body.name).toBe('a')
    })

    test('empty string is an invalid roomName', async () => {
        valueToTest('')
        await roomNameValidator(req, res, next)
        expectBadResult()
    })

    test('string with all spaces is an invalid roomName', async () => {
        valueToTest('     ')
        await roomNameValidator(req, res, next)
        expectBadResult()
    })

    test('null is an invalid roomName', async () => {
        valueToTest(null)
        await roomNameValidator(req, res, next)
        expectBadResult()
    })

    test('undefined is an invalid roomName', async () => {
        valueToTest(undefined)
        await roomNameValidator(req, res, next)
        expectBadResult()
    })


})
