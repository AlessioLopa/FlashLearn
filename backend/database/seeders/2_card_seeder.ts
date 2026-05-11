import Card from '#models/card'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Card.createMany([
      // Dataset 1 — Capitales européennes (user_id: 1)
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de France ?', verso: 'Paris' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Italie ?', verso: 'Rome' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Allemagne ?', verso: 'Berlin' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Espagne ?', verso: 'Madrid' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Portugal ?', verso: 'Lisbonne' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Royaume-Uni ?', verso: 'Londres' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Belgique ?', verso: 'Bruxelles' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Pays-Bas ?', verso: 'Amsterdam' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Suisse ?', verso: 'Berne' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Autriche ?', verso: 'Vienne' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Grèce ?', verso: 'Athènes' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Pologne ?', verso: 'Varsovie' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Suède ?', verso: 'Stockholm' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Norvège ?', verso: 'Oslo' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Danemark ?', verso: 'Copenhague' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Finlande ?', verso: 'Helsinki' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Irlande ?', verso: 'Dublin' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de République tchèque ?', verso: 'Prague' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Hongrie ?', verso: 'Budapest' },
      { user_id: 1, box: 1, recto: 'Quelle est la capitale de Russie ?', verso: 'Moscou' },

      // Dataset 2 — Capitales mondiales (user_id: 2)
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Japon ?', verso: 'Tokyo' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Chine ?', verso: 'Pékin' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Inde ?', verso: 'New Delhi' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Corée du Sud ?', verso: 'Séoul' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Thaïlande ?', verso: 'Bangkok' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Vietnam ?', verso: 'Hanoi' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Indonésie ?', verso: 'Jakarta' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Philippines ?', verso: 'Manille' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Australie ?', verso: 'Canberra' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Nouvelle-Zélande ?', verso: 'Wellington' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Etats-Unis ?', verso: 'Washington D.C.' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Canada ?', verso: 'Ottawa' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Mexique ?', verso: 'Mexico' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Brésil ?', verso: 'Brasilia' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Argentine ?', verso: 'Buenos Aires' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Chili ?', verso: 'Santiago' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Pérou ?', verso: 'Lima' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Colombie ?', verso: 'Bogotá' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Égypte ?', verso: 'Le Caire' },
      { user_id: 2, box: 1, recto: 'Quelle est la capitale de Maroc ?', verso: 'Rabat' },
    ])
  }
}