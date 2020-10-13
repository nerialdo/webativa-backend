'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

// Factory.blueprint('App/Models/User', (faker) => {
//   return {
//     username: faker.username()
//   }
// })
Factory.blueprint('Adonis/Acl/Role', (faker, index, data) => {
  const defaultValue = {
    slug: 'administrator',
    name: 'Administrator'
  }
  return Object.assign(defaultValue, data)
})

Factory.blueprint('App/Models/User', (faker, index, data) => {
  const defaultValue = {
    name: faker.username(),
    email: faker.email(),
    password: 'secret',
  }

  return Object.assign(defaultValue, data)
})

Factory.blueprint('App/Models/Token', (faker, i, data = {}) => {
  return {
    type: data.type || 'refreshtoken',
    token: faker.string({ length: 20 }),
    ...data,
  };
});

