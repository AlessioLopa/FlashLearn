import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)

    return response.created(user)
  }

  async login({ request, response }: HttpContext) {
    // Validate the payload with LoginValidator
    const { email, password } = await request.validateUsing(loginValidator)

    // Verify the user's credentials (email and password)
    const user = await User.verifyCredentials(email, password)

    // Create a new access token for the user
    const token = await User.accessTokens.create(user)

    //return the user and the token
    return response.ok({
      token: token,
      ...user.serialize(),
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const token = auth.user?.currentAccessToken.identifier

    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }

    await User.accessTokens.delete(user, token)

    return response.ok({ message: 'Logged out' })
  }
}
