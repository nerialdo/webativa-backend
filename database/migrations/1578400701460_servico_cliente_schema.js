'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServicoClienteSchema extends Schema {
  up () {
    this.create('servico_clientes', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('servico_id').unsigned().references('id').inTable('servicos').onDelete('CASCADE').onUpdate('CASCADE');
      table.decimal('valor', 8, 2).notNullable();
      table.integer('dias_carencia');
      table.date('data_primeiro_pagamento');
      table.date('data_proximo_pagamento');
      table.integer('parcelas').defaultTo(1);
      table.decimal('valor_parcela', 8, 2).notNullable();
      table.string('dominio').notNullable();
      table.text('info_add');
      table.integer('status').defaultTo(1); // 1 Ativa, 0 cancelado
      table.timestamps()
    })
  }

  down () {
    this.drop('servico_clientes')
  }
}

module.exports = ServicoClienteSchema
