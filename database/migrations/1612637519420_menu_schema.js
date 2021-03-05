'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ManuSchema extends Schema {
  up () {
    this.create('menus', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); // cliente
      table.string('nome').notNullable();
      table.string('icon').notNullable();
      table.string('link').notNullable();
      table.string('nivel').notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('menus')
  }
}

module.exports = ManuSchema
