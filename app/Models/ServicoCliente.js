'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ServicoCliente extends Model {

  user() {
    return this.belongsTo('App/Models/User');
  }

  servico() {
    return this.belongsTo('App/Models/Servico');
  }

  fatura() {
    return this.hasMany('App/Models/Fatura');
  }

}

module.exports = ServicoCliente
