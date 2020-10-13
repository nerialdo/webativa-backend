'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FaturaSchema extends Schema {
  up () {
    this.create('faturas', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); // cliente
      table.integer('servico_id').unsigned().references('id').inTable('servicos').onDelete('CASCADE').onUpdate('CASCADE'); // cliente
      table.integer('servico_clientes_id').unsigned().references('id').inTable('servico_clientes').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('mes_referencia')
      table.integer('ano_referencia')
      table.timestamp('vencimento');
      table.timestamp('data_pagamento');
      table.decimal('valor', 8, 2)
      table.text('obs');
      table.integer('status').defaultTo(1); //0 cancelado, 1 pendente, 2, pago
      table.timestamps()
    })
  }

  down () {
    this.drop('faturas')
  }
}

module.exports = FaturaSchema
