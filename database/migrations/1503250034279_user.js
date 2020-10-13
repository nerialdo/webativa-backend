'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      // table.string('usuario_pai', 254)
      table.integer('usuario_pai').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      table.string('tipo_conta', 254)
      table.string('cpf_cnpj', 254);
      table.string('cep', 254);
      table.string('pais', 254);
      table.string('estado', 254);
      table.string('cidade', 254);
      table.string('rua', 254);
      table.string('numero', 254);
      table.string('bairro', 254);
      table.string('telefone', 254);
      table.string('celular_whatsapp', 254);
      table.string('avatar', 254);
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
