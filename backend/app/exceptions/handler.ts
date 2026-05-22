import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import { errors as vineJSErrors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof Exception) {
      switch (error.code) {
        case 'E_ROW_NOT_FOUND':
          return ctx.response.notFound({ status: 404, message: 'Ressource introuvable' })
        case 'E_UNAUTHORIZED_ACCESS':
          return ctx.response.unauthorized({ status: 401, message: 'Non autorisé' })
        case 'E_INVALID_CREDENTIALS':
          return ctx.response.badRequest({ status: 400, message: 'Identifiants invalides' })
      }
    }

    if (error instanceof vineJSErrors.E_VALIDATION_ERROR) {
      return ctx.response.unprocessableEntity({
        status: 422,
        errors: error.messages,
      })
    }
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
