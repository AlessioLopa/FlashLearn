import { test } from '@japa/runner'

test.group('Register', () => {
  // TF-USR-03
  test('Register without data', async ({ client }) => {
    const response = await client.post('/api/register').json({
      email: '',
      password: '',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email field must be defined',
          field: 'email',
          rule: 'required',
        },
        {
          message: 'The password field must be defined',
          field: 'password',
          rule: 'required',
        },
      ],
    })
  })

  // TF-USR-04
  test('Register email not valid', async ({ client }) => {
    const response = await client.post('/api/register').json({
      email: 'test.com',
      password: 'password',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email field must be a valid email address',
          rule: 'email',
        },
      ],
    })
  })

  // TF-USR-02
  test('Register with existing email', async ({ client }) => {
    const response = await client.post('/api/register').json({
      email: 'alessio.lopardo@etml.ch',
      password: 'password',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email has already been taken',
          rule: 'database.unique',
          field: 'email',
        },
      ],
    })
  })

  // TF-USR-01
  test('Register valid user', async ({ client }) => {
    const response = await client.post('/api/register').json({
      email: 'user@test.ch',
      password: 'password',
    })
    response.assertStatus(201)
    response.assertBodyContains({
      email: 'user@test.ch',
    })
  })
})

test.group('Login', () => {
  // TF-USR-05
  test('Login with valid data', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'alessio.lopardo@etml.ch',
      password: 'password',
    })
    response.assertStatus(200)
  })

  // TF-USR-06
  test('Login with incorrect password', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'alessio.lopardo@etml.ch',
      password: 'wrongpassword',
    })
    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid user credentials',
        },
      ],
    })
  })

  // TF-USR-07
  test('Login without data', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: '',
      password: '',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email field must be defined',
          field: 'email',
          rule: 'required',
        },
        {
          message: 'The password field must be defined',
          field: 'password',
          rule: 'required',
        },
      ],
    })
  })

  // TF-USR-08
  test('Login email not valid', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'test.com',
      password: 'password',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email field must be a valid email address',
          rule: 'email',
        },
      ],
    })
  })

  // TF-USR-09
  test('Login with non existant email', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'test@test.com',
      password: 'password',
    })
    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid user credentials',
        },
      ],
    })
  })
})

test.group('Logout', () => {
  // TF-USR-10
  test('Logout with valid token', async ({ client }) => {
    const login = await client.post('/api/login').json({
      email: 'alessio.lopardo@etml.ch',
      password: 'password',
    })

    const response = await client.post('/api/logout').headers({
      Authorization: `Bearer ${login.body().token.token}`,
    })
    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Logged out',
    })
  })

  // TF-USR-11
  test('Logout without valid token', async ({ client }) => {
    const response = await client.post('/api/logout')
    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        {
          message: 'Unauthorized access',
        },
      ],
    })
  })
})
