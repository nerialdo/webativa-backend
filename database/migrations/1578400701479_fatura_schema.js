'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FaturaSchema extends Schema {
  up () {
    this.create('faturas', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); // cliente
      table.integer('servico_id').unsigned().references('id').inTable('servicos').onDelete('CASCADE').onUpdate('CASCADE'); // cliente
      table.integer('servico_cliente_id').unsigned().references('id').inTable('servico_clientes').onDelete('CASCADE').onUpdate('CASCADE');
      table.text('id_integracao')
      table.integer('mes_referencia')
      table.integer('ano_referencia')
      table.date('vencimento');
      table.date('data_pagamento');
      table.decimal('valor', 8, 2)
      table.decimal('valor_liquido', 8, 2)
      table.text('obs');
      table.text('link_fartura');
      table.text('link_fartura_aux');
      table.text('metodo_pagamento');
      table.integer('status').defaultTo(1); //0 cancelado, 1 pendente, 2, pago
      table.timestamps()
    })
  }

  down () {
    this.drop('faturas')
  }
}

module.exports = FaturaSchema
