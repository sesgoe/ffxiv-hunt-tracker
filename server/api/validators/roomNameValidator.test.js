const {roomNameValidator, roomNameValidatorHelper} = require('./roomNameValidator')

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

test('smoke test for validator', async () => {
    
})