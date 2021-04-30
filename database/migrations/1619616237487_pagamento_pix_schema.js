'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PagamentoPixSchema extends Schema {
  up () {
    this.create('pagamento_pixes', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); // cliente
      table.integer('fatura_id').unsigned().references('id').inTable('faturas').onDelete('CASCADE').onUpdate('CASCADE'); // cliente
      table.string('calendario')
      table.string('horario_transferencia')
      table.string('loc')
      table.string('endToEndId')
      table.string('txid')
      table.string('chave')
      table.string('infoPagador')
      table.string('status').defaultTo('Aberto');
      table.timestamps()
    })
  }

  down () {
    this.drop('pagamento_pixes')
  }
}

module.exports = PagamentoPixSchema
