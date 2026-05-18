/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import CardsController from '#controllers/cards_controller'
import ReviewsController from '#controllers/reviews_controller'

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
  })
  .prefix('/api')

router
  .group(() => {
    router.post('/:id/reviews/answer', [ReviewsController, 'answer'])
    router.get('/reviews', [ReviewsController, 'review'])
  })
  .prefix('/api/cards')
  .use(middleware.auth())

router
  .group(() => {
    router.resource('cards', CardsController)
  })
  .prefix('/api')
  .use(middleware.auth())
