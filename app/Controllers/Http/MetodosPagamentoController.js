'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const MetodosPagamento = use('App/Models/MetodosPagamento');
/**
 * Resourceful controller for interacting with metodospagamentos
 */
class MetodosPagamentoController {

  async index ({ request, response, view }) {
    const metodosPagamento = await MetodosPagamento.query()
    //.where('user_id', auth.user.email)
    .orderBy('id', 'desc')
    .fetch();

    return metodosPagamento;
  }

  async store ({ request, response }) {
  }

  async show ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = MetodosPagamentoController
