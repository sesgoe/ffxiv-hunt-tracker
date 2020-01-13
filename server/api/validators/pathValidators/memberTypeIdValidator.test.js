const {memberTypeIdValidator} = require('./memberTypeIdValidator')

describe('memberTypeIdValidator', () => {

    let res = jest.fn()
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    let next = jest.fn()
    let req = {
        params: {}
    }

    valueToTest = (value) => {
        req.params.memberTypeId = value
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

    test('1 is a valid memberTypeId', async () => {
        valueToTest(1)
        await memberTypeIdValidator(req, res, next)
        expectGoodResult()
    })

    test('2 is a valid memberTypeId', async () => {
        valueToTest(2)
        await memberTypeIdValidator(req, res, next)
        expectGoodResult()
    })

    test('3 is a valid memberTypeId', async () => {
        valueToTest(3)
        await memberTypeIdValidator(req, res, next)
        expectGoodResult()
    })

    test('4 is a valid memberTypeId', async () => {
        valueToTest(4)
        await memberTypeIdValidator(req, res, next)
        expectGoodResult()
    })

    test('0 is an invalid memberTypeId', async () => {
        valueToTest(0)
        await memberTypeIdValidator(req, res, next)
        expectBadResult()
    })

    test('-1 is an invalid memberTypeId', async () => {
        valueToTest(-1)
        await memberTypeIdValidator(req, res, next)
        expectBadResult()
    })

    test('empty string is an invalid memberTypeId', async () => {
        valueToTest('')
        await memberTypeIdValidator(req, res, next)
        expectBadResult()
    })

    test('null is an invalid memberTypeId', async () => {
        valueToTest(null)
        await memberTypeIdValidator(req, res, next)
        expectBadResult()
    })

    test('undefined is an invalid memberTypeId', async () => {
        valueToTest(undefined)
        await memberTypeIdValidator(req, res, next)
        expectBadResult()
    })


})
