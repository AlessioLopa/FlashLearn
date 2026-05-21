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
      return response.notFound({ message: 'Ressource introuvable' })
    }

    if (await bouncer.denies('isReviewable', card, now)) {
      return response.badRequest({ message: "La carte n'est pas encore prête à être révisée" })
    }
    const { success } = await request.validateUsing(reviewValidator)

    if (success) {
      switch (card.box) {
        case 1:
          card.merge({
            box: 2,
            next_review_at: now.plus({ [typeTimeDelay]: delayBox2 }),
          })

          break
        case 2:
          card.merge({
            box: 3,
            next_review_at: now.plus({ [typeTimeDelay]: delayBox3 }),
          })

          break
        case 3:
          card.merge({
            box: 4,
            next_review_at: now.plus({ [typeTimeDelay]: delayBox4 }),
          })

          break
        case 4:
          card.merge({
            box: 5,
            next_review_at: now.plus({ [typeTimeDelay]: delayBox5 }),
          })

          break
        case 5:
          card.merge({
            next_review_at: now.plus({ [typeTimeDelay]: delayBox5 }),
          })

          break
      }
    } else {
      card.merge({
        box: 1,
        next_review_at: now.plus({ [typeTimeDelay]: delayBox1 }),
      })
    }

    await card.save()

    return response.ok({ message: 'Review recorded', success: success, card: card })
  }

  async review({ response, auth }: HttpContext) {
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
      return response.badRequest({ message: 'Aucune carte à réviser' })
    }

    return response.ok(cards)
  }
}
