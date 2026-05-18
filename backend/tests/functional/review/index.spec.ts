import Card from '#models/card'
import User from '#models/user'
import { test } from '@japa/runner'
import { DateTime } from 'luxon'

test.group('Review index', (group) => {
  let token: string
  let userId: number
  let cardReviews: Card[]

  group.setup(async () => {
    const user1 = await User.findByOrFail('email', 'alessio.lopardo@etml.ch')
    userId = user1.id

    const tokenObj = await User.accessTokens.create(user1)
    token = tokenObj.value!.release()

    cardReviews = await Card.query()
      .where('user_id', user1!.id)
      .andWhere((query) => {
        query.where('next_review_at', '<=', new Date()).orWhereNull('next_review_at')
      })
      .orderBy('box', 'asc')
      .limit(12)
      .exec()
  })

  // TF-LTN-01
  test('TF-LTN-01 - Card with box at 1, correct answer -> box at 2', async ({ client, assert }) => {
    const card = cardReviews.find((c) => c.box === 1)

    const before = DateTime.now()

    const response = await client
      .post(`/api/cards/${card!.id}/reviews/answer`)
      .json({ success: true })
      .headers({ Authorization: `Bearer ${token}` })
      .send()

    const reviewedCard = await Card.findOrFail(card!.id)
    assert.equal(reviewedCard.box, 2)

    const expected = before.plus({ hours: 48 })

    // Micro seconds of marge as the next_review_at is set in the route. So the value should always be above the expected value by micro seconds
    assert.isAbove(expected, reviewedCard.next_review_at!)
    response.assertStatus(200)
  })

  // TF-LTN-02
  test('TF-LTN-02 - Card with box at 2, correct answer -> box at 3', async ({ client, assert }) => {
    const card = await Card.create({
      user_id: userId,
      box: 2,
      recto: 'TF-LTN-02 recto',
      verso: 'TF-LTN-02 verso',
      next_review_at: null,
    })

    const before = DateTime.now()

    const response = await client
      .post(`/api/cards/${card.id}/reviews/answer`)
      .json({ success: true })
      .headers({ Authorization: `Bearer ${token}` })
      .send()

    const reviewedCard = await Card.findOrFail(card.id)

    const expected = before.plus({ hours: 120 })
    assert.isAbove(expected, reviewedCard.next_review_at!)
    response.assertStatus(200)
    assert.equal(reviewedCard.box, 3)
  })

  // TF-LTN-03
  test('TF-LTN-03 - Card with box at 3, correct answer -> box at 4', async ({ client, assert }) => {
    const card = await Card.create({
      user_id: userId,
      box: 3,
      recto: 'TF-LTN-03 recto',
      verso: 'TF-LTN-03 verso',
      next_review_at: null,
    })

    const before = DateTime.now()

    const response = await client
      .post(`/api/cards/${card.id}/reviews/answer`)
      .json({ success: true })
      .headers({ Authorization: `Bearer ${token}` })
      .send()

    const reviewedCard = await Card.findOrFail(card.id)

    const expected = before.plus({ hours: 360 })
    assert.isAbove(expected, reviewedCard.next_review_at!)
    response.assertStatus(200)
    assert.equal(reviewedCard.box, 4)
  })

  // TF-LTN-04
  test('TF-LTN-04 - Card with box at 4, correct answer -> box at 5', async ({ client, assert }) => {
    const card = await Card.create({
      user_id: userId,
      box: 4,
      recto: 'TF-LTN-04 recto',
      verso: 'TF-LTN-04 verso',
      next_review_at: null,
    })

    const before = DateTime.now()

    const response = await client
      .post(`/api/cards/${card.id}/reviews/answer`)
      .json({ success: true })
      .headers({ Authorization: `Bearer ${token}` })
      .send()

    const reviewedCard = await Card.findOrFail(card.id)

    const expected = before.plus({ hours: 720 })
    assert.isAbove(expected, reviewedCard.next_review_at!)
    response.assertStatus(200)
    assert.equal(reviewedCard.box, 5)
  })

  // TF-LTN-05
  test('TF-LTN-05 - Card with box at 5, correct answer -> box stays at 5, next_review_at recalculated', async ({
    client,
    assert,
  }) => {
    const card = await Card.create({
      user_id: userId,
      box: 5,
      recto: 'TF-LTN-05 recto',
      verso: 'TF-LTN-05 verso',
      next_review_at: null,
    })

    const before = DateTime.now()

    const response = await client
      .post(`/api/cards/${card.id}/reviews/answer`)
      .json({ success: true })
      .headers({ Authorization: `Bearer ${token}` })
      .send()

    const reviewedCard = await Card.findOrFail(card.id)

    const expected = before.plus({ hours: 720 })
    assert.isAbove(expected, reviewedCard.next_review_at!)
    response.assertStatus(200)
    assert.equal(reviewedCard.box, 5)
  })

  // TF-LTN-06
  test('TF-LTN-06 - Card with box at 1, wrong answer -> box at 1', async ({ client, assert }) => {
    const card = await Card.create({
      user_id: userId,
      box: 1,
      recto: 'TF-LTN-06 recto',
      verso: 'TF-LTN-06 verso',
      next_review_at: null,
    })

    const before = DateTime.now()

    const response = await client
      .post(`/api/cards/${card.id}/reviews/answer`)
      .json({ success: false })
      .headers({ Authorization: `Bearer ${token}` })
      .send()

    const reviewedCard = await Card.findOrFail(card.id)

    const expected = before.plus({ hours: 24 })

    assert.isAbove(expected, reviewedCard.next_review_at!)
    response.assertStatus(200)
    assert.equal(reviewedCard.box, 1)
  })

  // TF-LTN-07
  test('TF-LTN-07 - Get cards to review -> max 12 cards, sorted by box asc', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/api/cards/reviews')
      .headers({ Authorization: `Bearer ${token}` })
      .send()

    response.assertStatus(200)

    const cards = response.body()
    assert.isAtMost(cards.length, 12)

    const boxes = cards.map((c: Card) => c.box)
    assert.deepEqual(boxes, [...boxes].sort())
  })

  // TF-LTN-08
  test('TF-LTN-08 - DEMO_MODE active -> delays applied in seconds instead of hours', async ({
    client,
    assert,
  }) => {
    const previousDemoMode = process.env.DEMO_MODE
    process.env.DEMO_MODE = 'true'

    try {
      const card = await Card.create({
        user_id: userId,
        box: 1,
        recto: 'TF-LTN-08 recto',
        verso: 'TF-LTN-08 verso',
        next_review_at: null,
      })

      const before = DateTime.now()

      const response = await client
        .post(`/api/cards/${card.id}/reviews/answer`)
        .json({ success: true })
        .headers({ Authorization: `Bearer ${token}` })
        .send()

      const reviewedCard = await Card.findOrFail(card.id)

      response.assertStatus(200)
      assert.equal(reviewedCard.box, 2)

      const lowerBound = before.plus({ seconds: 47 })
      const upperBound = before.plus({ seconds: 60 })
      assert.isAbove(reviewedCard.next_review_at!, lowerBound)
      assert.isAbove(upperBound, reviewedCard.next_review_at!)
    } finally {
      if (previousDemoMode === undefined) {
        delete process.env.DEMO_MODE
      } else {
        process.env.DEMO_MODE = previousDemoMode
      }
    }
  })

  // TF-LTN-09
  test('TF-LTN-09 - Answer review without auth token -> 401, card unchanged', async ({
    client,
    assert,
  }) => {
    const card = await Card.create({
      user_id: userId,
      box: 1,
      recto: 'TF-LTN-09 recto',
      verso: 'TF-LTN-09 verso',
      next_review_at: null,
    })

    const response = await client
      .post(`/api/cards/${card.id}/reviews/answer`)
      .json({ success: true })
      .send()

    response.assertStatus(401)

    const reviewedCard = await Card.findOrFail(card.id)
    assert.equal(reviewedCard.box, 1)
    assert.isNull(reviewedCard.next_review_at)
  })

  // TF-LTN-10
  test('TF-LTN-10 - Get cards to review without auth token -> 401, no data', async ({
    client,
    assert,
  }) => {
    const response = await client.get('/api/cards/reviews').send()

    response.assertStatus(401)
    assert.notDeepEqual(response.body(), { message: 'No cards to review' })
  })

  // TF-LTN-11
  test('TF-LTN-11 - Answer review on a card belonging to another user -> 404, card unchanged', async ({
    client,
    assert,
  }) => {
    const userB = await User.findByOrFail('email', 'gregory.charmier@etml.ch')

    const card = await Card.create({
      user_id: userB.id,
      box: 1,
      recto: 'TF-LTN-11 recto',
      verso: 'TF-LTN-11 verso',
      next_review_at: null,
    })

    const response = await client
      .post(`/api/cards/${card.id}/reviews/answer`)
      .json({ success: true })
      .headers({ Authorization: `Bearer ${token}` })
      .send()

    response.assertStatus(404)

    const reviewedCard = await Card.findOrFail(card.id)
    assert.equal(reviewedCard.box, 1)
    assert.isNull(reviewedCard.next_review_at)
  })
})
