'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ServicoCliente extends Model {

  servico() {
    return this.belongsTo('App/Models/Servico');
  }

}

module.exports = ServicoCliente
