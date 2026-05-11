import { cardSecurity } from '#abilities/main'
import card from '#models/card'
import Card from '#models/card'
import { cardValidator } from '#validators/card'
import type { HttpContext } from '@adonisjs/core/http'

export default class CardsController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user

    const cards = await Card.query().where('user_id', user!.id).exec()
    return response.ok(cards)
  }

  /**
   * Display form to create a new record
   */
  async create({ }: HttpContext) {

  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    const payload = await request.validateUsing(cardValidator)

    const card = await Card.create({
      recto: payload.recto,
      verso: payload.verso,
      user_id: user!.id,
      box: 1,
      next_review_at: null
    })

    return response.created(card)
  }

  /**
   * Show individual record
   */
  async show({ params, response, bouncer }: HttpContext) {

    const card = await Card.findOrFail(params.id)

    if (await bouncer.denies(cardSecurity, card)) {
      return response.notFound({ message: 'Card not found' })
    }

    return response.ok(card)
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) { }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) { }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) { }
}