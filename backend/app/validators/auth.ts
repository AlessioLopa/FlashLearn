import vine from '@vinejs/vine'

export const loginValidator = vine.compile(vine.object({
    email: vine.string().email().minLength(3).maxLength(254),
    password: vine.string().minLength(8).maxLength(255)
}))


export const registerValidator = vine.compile(vine.object({
    email: vine.string().email().minLength(3).maxLength(254).unique(async (query, field) => {
        const user = await query.from('users')
            .where('email', field)
            .first()
        return !user // Transform the value to Boolean for validation
    }),
    password: vine.string().minLength(8).maxLength(255)
}))