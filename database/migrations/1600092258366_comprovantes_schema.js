'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ComprovantesSchema extends Schema {
  up () {
    this.create('comprovantes', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('pagamento_id').unsigned().references('id').inTable('pagamentos').onDelete('CASCADE').onUpdate('CASCADE');
      table.string('name');
      table.string('key');
      table.string('url');
      table.string('content_type');
      table.timestamps()
    })
  }

  down () {
    this.drop('comprovantes')
  }
}

module.exports = ComprovantesSchema
