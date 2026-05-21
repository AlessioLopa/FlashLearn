/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const CardsController = () => import('#controllers/cards_controller')
const ReviewsController = () => import('#controllers/reviews_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

router.get('swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

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
