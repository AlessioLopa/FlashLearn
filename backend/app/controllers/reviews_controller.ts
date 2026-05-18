import { cardSecurity } from '#abilities/main'
import Card from '#models/card'
import { reviewValidator } from '#validators/review'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ReviewsController {
  async answer({ params, request, response, bouncer }: HttpContext) {
    const delayBox1 = 24
    const delayBox2 = 2 * 24
    const delayBox3 = 5 * 24
    const delayBox4 = 15 * 24
    const delayBox5 = 30 * 24

    let typeTimeDelay = 'hours'

    const now = DateTime.now()

    if (process.env.DEMO_MODE === 'true') {
      typeTimeDelay = 'seconds'
    }

    const card = await Card.findOrFail(params.id)

    if (await bouncer.denies(cardSecurity, card)) {
      return response.notFound({ message: 'Card not found' })
    }

    if (await bouncer.denies('isReviewable', card, now)) {
      return response.badRequest({ message: 'Card is not reviewable yet' })
    }
    const success = await request.validateUsing(reviewValidator)
    console.debug('Review answer received:', success)
    console.debug('Current card state before review:', card.box)

    if (success) {
      switch (card.box) {
        case 1:
          card.merge({
            box: 2,
            next_review_at: now.plus({ [typeTimeDelay]: delayBox2 }),
          })
          card.save()
          break
        case 2:
          card.merge({
            box: 3,
            next_review_at: now.plus({ [typeTimeDelay]: delayBox3 }),
          })
          card.save()
          break
        case 3:
          card.merge({
            box: 4,
            next_review_at: now.plus({ [typeTimeDelay]: delayBox4 }),
          })
          card.save()
          break
        case 4:
          card.merge({
            box: 5,
            next_review_at: now.plus({ [typeTimeDelay]: delayBox5 }),
          })
          card.save()
          break
        case 5:
          card.merge({
            next_review_at: now.plus({ [typeTimeDelay]: delayBox5 }),
          })
          card.save()
          break
      }
    }

    if (!success) {
      card.merge({
        box: 1,
        next_review_at: now.plus({ [typeTimeDelay]: delayBox1 }),
      })
      card.save()
    }

    console.debug('Current card state after review:', card.box)

    return response.ok({ message: 'Review recorded', success: success, card: card })
  }

  async review({ request, response, bouncer, auth }: HttpContext) {
    const user = auth.user

    const cards = await Card.query()
      .where('user_id', user!.id)
      .andWhere((query) => {
        query.where('next_review_at', '<=', new Date()).orWhereNull('next_review_at')
      })
      .orderBy('box', 'asc')
      .limit(12)
      .exec()

    if (cards.length === 0) {
      return response.ok({ message: 'No cards to review' })
    }

    return response.ok(cards)
  }
}
