import vine from '@vinejs/vine'

export const reviewValidator = vine.compile(
  vine.object({
    success: vine.boolean(),
  })
)
