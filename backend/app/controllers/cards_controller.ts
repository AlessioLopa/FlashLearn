import { cardSecurity } from '#abilities/main'
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
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    const cardCount = await Card.query().where('user_id', user!.id).where('box', 1).exec()

    if (cardCount.length >= 20) {
      return response.unprocessableEntity({
        message:
          'Vous avez atteitnt le nombre maximum de cartes en box 1 (20). Veuillez réviser vos cartes pour en ajouter de nouvelles.',
      })
    }

    const payload = await request.validateUsing(cardValidator)

    const card = await Card.create({
      recto: payload.recto,
      verso: payload.verso,
      user_id: user!.id,
      box: 1,
      next_review_at: null,
    })

    return response.created(card)
  }

  /**
   * Show individual record
   */
  async show({ params, response, bouncer }: HttpContext) {
    const card = await Card.findOrFail(params.id)

    // Check if the user is the author of the card if not return 404
    if (await bouncer.denies(cardSecurity, card)) {
      return response.notFound({ message: 'Ressource introuvable' })
    }

    return response.ok(card)
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, bouncer }: HttpContext) {
    const card = await Card.findOrFail(params.id)

    if (await bouncer.denies(cardSecurity, card)) {
      return response.notFound({ message: 'Ressource introuvable' })
    }

    const payload = await request.validateUsing(cardValidator)

    // Create an object with the new values of the card
    card.merge(payload)

    // Save the new values to the database
    await card.save()

    return response.ok(card)
  }

  /**
   * Delete record
   */
  async destroy({ params, response, bouncer }: HttpContext) {
    const card = await Card.findOrFail(params.id)

    // Check if the user is the author of the card if not return 404
    if (await bouncer.denies(cardSecurity, card)) {
      return response.notFound({ message: 'Ressource introuvable' })
    }

    await card.delete()
    return response.noContent()
  }
}
