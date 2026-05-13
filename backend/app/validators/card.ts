import vine from '@vinejs/vine'

export const cardValidator = vine.compile(
  vine.object({
    recto: vine.string().minLength(1),
    verso: vine.string().minLength(1),
  })
)
