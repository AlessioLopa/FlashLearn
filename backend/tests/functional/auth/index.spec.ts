import { test } from '@japa/runner'

test.group('Register', () => {
  // TF-USR-03
  test('TF-USR-03 - Register without data', async ({ client }) => {
    const response = await client.post('/api/register').json({
      email: '',
      password: '',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'Le champ email est requis',
          field: 'email',
          rule: 'required',
        },
        {
          message: 'Le champ password est requis',
          field: 'password',
          rule: 'required',
        },
      ],
    })
  })

  // TF-USR-04
  test('TF-USR-04 - Register email not valid', async ({ client }) => {
    const response = await client.post('/api/register').json({
      email: 'test.com',
      password: 'password',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'Email invalide',
          rule: 'email',
        },
      ],
    })
  })

  // TF-USR-02
  test('TF-USR-02 - Register with existing email', async ({ client }) => {
    const response = await client.post('/api/register').json({
      email: 'alessio.lopardo@etml.ch',
      password: 'password',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'Cet email est déjà utilisé',
          rule: 'database.unique',
          field: 'email',
        },
      ],
    })
  })

  // TF-USR-01
  test('TF-USR-01 - Register valid user', async ({ client }) => {
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
  test('TF-USR-05 - Login with valid data', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'alessio.lopardo@etml.ch',
      password: 'password',
    })
    response.assertStatus(200)
  })

  // TF-USR-06
  test('TF-USR-06 - Login with incorrect password', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'alessio.lopardo@etml.ch',
      password: 'wrongpassword',
    })
    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Identifiants invalides',
    })
  })

  // TF-USR-07
  test('TF-USR-07 - Login without data', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: '',
      password: '',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'Le champ email est requis',
          field: 'email',
          rule: 'required',
        },
        {
          message: 'Le champ password est requis',
          field: 'password',
          rule: 'required',
        },
      ],
    })
  })

  // TF-USR-08
  test('TF-USR-08 - Login email not valid', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'test.com',
      password: 'password',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'Email invalide',
          rule: 'email',
        },
      ],
    })
  })

  // TF-USR-09
  test('TF-USR-09 - Login with non existant email', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'test@test.com',
      password: 'password',
    })
    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Identifiants invalides',
    })
  })
})

test.group('Logout', () => {
  // TF-USR-10
  test('TF-USR-10 - Logout with valid token', async ({ client }) => {
    const login = await client.post('/api/login').json({
      email: 'alessio.lopardo@etml.ch',
      password: 'password',
    })

    const response = await client.post('/api/logout').headers({
      Authorization: `Bearer ${login.body().token.token}`,
    })
    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Déconnexion réussie',
    })
  })

  // TF-USR-11
  test('TF-USR-11 - Logout without valid token', async ({ client }) => {
    const response = await client.post('/api/logout')
    response.assertStatus(401)
    response.assertBodyContains({
      message: 'Non autorisé',
    })
  })
})
