import { test } from '@japa/runner'

test.group('Register', () => {
  test('Register without data', async ({ client }) => {
    const response = await client.post('/api/register').json({
      email: '',
      password: ''
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email field must be defined',
          field: 'email',
          rule: 'required'
        },
        {
          message: 'The password field must be defined',
          field: 'password',
          rule: 'required'
        }
      ]
    })
  })

  test('Register email not valid', async ({ client }) => {
    const response = await client.post('/api/register').json({
      email: 'test.com',
      password: 'password'
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email field must be a valid email address',
          rule: 'email'
        }
      ]
    })
  })

  test('Register with existing email', async ({ client }) => {
    const response = await client.post('/api/register').json({
      email: 'alessio.lopardo@etml.ch',
      password: 'password'
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{
        message: "The email has already been taken",
        rule: "database.unique",
        field: "email"
      }]
    })

  })

  test('Register valid user', async ({ client }) => {
    const response = await client.post('/api/register').json({
      email: 'user@test.ch',
      password: 'password'
    })
    response.assertStatus(201)
    response.assertBodyContains({
      email: 'user@test.ch'
    })


  })
})


test.group('Login', () => {
  test('Login with valid data', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'alessio.lopardo@etml.ch',
      password: 'password'
    })
    response.assertStatus(200)

  })

  test('Login with incorrect password', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'alessio.lopardo@etml.ch',
      password: 'wrongpassword'
    })
    response.assertStatus(400)
    response.assertBodyContains({
      errors: [{
        message: 'Invalid user credentials'
      }]
    })
  })


  test('Login without data', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: '',
      password: ''
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email field must be defined',
          field: 'email',
          rule: 'required'
        },
        {
          message: 'The password field must be defined',
          field: 'password',
          rule: 'required'
        }
      ]
    })
  })


  test('Login email not valid', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'test.com',
      password: 'password'
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email field must be a valid email address',
          rule: 'email'
        }
      ]
    })
  })


  test('Login with non existant email', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'test@test.com',
      password: 'password'
    })
    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid user credentials',
        }
      ]
    })
  })

})

test.group('Logout', () => {
  test('Logout with valid token', async ({ client }) => {
    const login = await client.post('/api/login').json({
      email: "alessio.lopardo@etml.ch",
      password: "password"
    })

    const response = await client.post("/api/logout").headers({
      "Authorization": `Bearer ${login.body().token.token}`
    })
    response.assertStatus(200)
    response.assertBodyContains({
      message: "Logged out"
    })
  })

  test('Logout without valid token', async ({ client }) => {

    const response = await client.post("/api/logout")
    response.assertStatus(401)
    response.assertBodyContains({
      errors: [{
        message: "Unauthorized access"
      }]
    })
  })
})