import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        email: 'alessio.lopardo@etml.ch',
        password: 'password'
      },
      {
        email: 'gregory.charmier@etml.ch',
        password: 'password'
      }
    ])

  }
}