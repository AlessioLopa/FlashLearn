import { test } from '@japa/runner'
import User from '#models/user'
import Card from '#models/card'

test.group('READ', (group) => {
  let token: string
  let user1CardId: number
  let user2CardId: number

  group.setup(async () => {
    const user1 = await User.findByOrFail('email', 'alessio.lopardo@etml.ch')
    const user2 = await User.findByOrFail('email', 'gregory.charmier@etml.ch')

    const tokenObj = await User.accessTokens.create(user1)
    token = tokenObj.value!.release()

    user1CardId = (await Card.query().where('user_id', user1.id).firstOrFail()).id
    user2CardId = (await Card.query().where('user_id', user2.id).firstOrFail()).id
  })

  // TF-CRD-01
  test('TF-CRD-01 - Get all cards of authenticated user', async ({ client }) => {
    const response = await client.get('/api/cards').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    response.assertBodyContains([{}])
  })

  // TF-CRD-02
  test('TF-CRD-02 - Get a specific card', async ({ client }) => {
    const response = await client
      .get(`/api/cards/${user1CardId}`)
      .header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
  })

  // TF-CRD-03
  test('TF-CRD-03 - Get a non-existent card', async ({ client }) => {
    const response = await client.get('/api/cards/99999').header('Authorization', `Bearer ${token}`)
    response.assertStatus(404)
  })

  // TF-CRD-11
  test('TF-CRD-11 - Access without authentication token', async ({ client }) => {
    const response = await client.get('/api/cards')
    response.assertStatus(401)
  })

  // TF-CRD-12
  test('TF-CRD-12 - Access another user card (security by resource)', async ({ client }) => {
    const response = await client
      .get(`/api/cards/${user2CardId}`)
      .header('Authorization', `Bearer ${token}`)
    response.assertStatus(404)
  })
})

test.group('CREATE', (group) => {
  let tokenUserWithFullBox: string
  let tokenUserWithEmptyBox: string

  group.setup(async () => {
    // User 1 with full box 1 for TF-CRD-06
    const user1 = await User.findByOrFail('email', 'alessio.lopardo@etml.ch')
    const t1 = await User.accessTokens.create(user1)
    tokenUserWithFullBox = t1.value!.release()

    // New user with empty box 1 for TF-CRD-04 et TF-CRD-05
    const freshUser = await User.create({ email: 'createtest@test.ch', password: 'password' })
    const t2 = await User.accessTokens.create(freshUser)
    tokenUserWithEmptyBox = t2.value!.release()
  })

  // TF-CRD-04
  test('TF-CRD-04 - Create card with valid fields', async ({ client }) => {
    const response = await client
      .post('/api/cards')
      .header('Authorization', `Bearer ${tokenUserWithEmptyBox}`)
      .json({ recto: 'Question test', verso: 'Réponse test' })
    response.assertStatus(201)
    response.assertBodyContains({ recto: 'Question test', verso: 'Réponse test' })
  })

  // TF-CRD-05
  test('TF-CRD-05 - Create card with empty fields', async ({ client }) => {
    const response = await client
      .post('/api/cards')
      .header('Authorization', `Bearer ${tokenUserWithEmptyBox}`)
      .json({ recto: '', verso: '' })
    response.assertStatus(422)
  })

  // TF-CRD-06
  test('TF-CRD-06 - Create card refused when box 1 already has 20 cards', async ({ client }) => {
    const response = await client
      .post('/api/cards')
      .header('Authorization', `Bearer ${tokenUserWithFullBox}`)
      .json({ recto: 'Question test', verso: 'Réponse test' })
    response.assertStatus(422)
  })
})

test.group('UPDATE', (group) => {
  let token: string
  let cardId: number

  group.setup(async () => {
    const user1 = await User.findByOrFail('email', 'alessio.lopardo@etml.ch')
    const tokenObj = await User.accessTokens.create(user1)
    token = tokenObj.value!.release()

    cardId = (await Card.query().where('user_id', user1.id).firstOrFail()).id
  })

  // TF-CRD-07
  test('TF-CRD-07 - Update an existing card', async ({ client }) => {
    const response = await client
      .put(`/api/cards/${cardId}`)
      .header('Authorization', `Bearer ${token}`)
      .json({ recto: 'Recto modifié', verso: 'Verso modifié' })
    response.assertStatus(200)
    response.assertBodyContains({ recto: 'Recto modifié', verso: 'Verso modifié' })
  })

  // TF-CRD-08
  test('TF-CRD-08 - Update a non-existent card', async ({ client }) => {
    const response = await client
      .put('/api/cards/99999')
      .header('Authorization', `Bearer ${token}`)
      .json({ recto: 'Recto modifié', verso: 'Verso modifié' })
    response.assertStatus(404)
  })
})

test.group('DELETE', (group) => {
  let token: string
  let cardToDeleteId: number

  group.setup(async () => {
    const user1 = await User.findByOrFail('email', 'alessio.lopardo@etml.ch')
    const tokenObj = await User.accessTokens.create(user1)
    token = tokenObj.value!.release()

    const card = await Card.create({
      user_id: user1.id,
      box: 1,
      recto: 'Card to delete',
      verso: 'Answer',
      next_review_at: null,
    })
    cardToDeleteId = card.id
  })

  // TF-CRD-09
  test('TF-CRD-09 - Delete an existing card', async ({ client }) => {
    const response = await client
      .delete(`/api/cards/${cardToDeleteId}`)
      .header('Authorization', `Bearer ${token}`)
    response.assertStatus(204)
  })

  // TF-CRD-10
  test('TF-CRD-10 - Delete a non-existent card', async ({ client }) => {
    const response = await client
      .delete('/api/cards/99999')
      .header('Authorization', `Bearer ${token}`)
    response.assertStatus(404)
  })
})
