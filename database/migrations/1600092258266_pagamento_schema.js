'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PagamentoSchema extends Schema {
  up () {
    this.create('pagamentos', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); // pagador
      table.integer('servico_id').unsigned().references('id').inTable('servicos').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('fatura_id').unsigned().references('id').inTable('faturas').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('metodos_pagamentos_id').unsigned().references('id').inTable('metodos_pagamentos').onDelete('CASCADE').onUpdate('CASCADE');
      table.decimal('valor_fatura', 8, 2);
      table.decimal('valor', 8, 2).notNullable();
      table.text('obs');
      table.integer('status').defaultTo(1); //0cancelado, 1 ativo
      table.timestamps()
    })
  }

  down () {
    this.drop('pagamentos')
  }
}

module.exports = PagamentoSchema
