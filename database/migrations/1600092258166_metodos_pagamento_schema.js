'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MetodosPagamentoSchema extends Schema {
  up () {
    this.create('metodos_pagamentos', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      table.string('name');
      table.text('inf');
      table.integer('status').defaultTo(1); //0cancelado, 1 ativo
      table.timestamps()
    })
  }

  down () {
    this.drop('metodos_pagamentos')
  }
}

module.exports = MetodosPagamentoSchema
