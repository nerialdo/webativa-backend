'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServicoSchema extends Schema {
  up () {
    this.create('servicos', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('categoria_id').unsigned().references('id').inTable('categorias').onDelete('SET NULL').onUpdate('CASCADE');
      table.string('nome').notNullable();
      // table.string('recorrencia');// 1 recorrente, 2 unico
      table.decimal('valor', 8, 2).notNullable();
      table.integer('status').defaultTo(1); //0 cancelado, 1 ativo
      table.timestamps();
    })
  }

  down () {
    this.drop('servicos')
  }
}

module.exports = ServicoSchema
