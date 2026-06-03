/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import Card from '#models/card'
import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'
import { DateTime } from 'luxon'

/**
 * Delete the following ability to start from
 * scratch
 */
export const cardSecurity = Bouncer.ability((user: User, card: Card) => {
  return user.id === card.user_id
})

//--ignore-ts-errors
export const isReviewable = Bouncer.ability((user: User, card: Card, now: DateTime) => {
  return card.next_review_at === null || card.next_review_at <= now || card.user_id === user.id
})
