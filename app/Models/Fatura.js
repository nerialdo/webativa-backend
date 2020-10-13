'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Fatura extends Model {

  user() {
    return this.belongsTo('App/Models/User');
  }

  servico() {
    return this.belongsTo('App/Models/Servico');
  }

  pagamento() {
    return this.hasOne('App/Models/Pagamento');
  }
}

module.exports = Fatura

