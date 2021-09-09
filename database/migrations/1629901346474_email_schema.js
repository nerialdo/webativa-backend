'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EmailSchema extends Schema {
  up () {
    this.create('emails', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); 
      table.string('to')
      table.string('from')
      table.string('subject')
      table.string('conteudo')
      table.string('status')
      table.timestamps()
    })
  }

  down () {
    this.drop('emails')
  }
}

module.exports = EmailSchema
