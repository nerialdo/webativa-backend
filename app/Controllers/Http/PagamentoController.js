'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const Pagamento = use('App/Models/Pagamento');
/**
 * Resourceful controller for interacting with pagamentos
 */
class PagamentoController {

  async index ({ request, response, view }) {
    const pagamento = await Pagamento.query()
    //.where('user_id', auth.user.email)
    .orderBy('id', 'desc')
    .fetch();

    return pagamento;
  }

  async store ({ request, response }) {
    const data = request.only([
      'user_id', 'servico_id','fatura_id', 'metodos_pagamentos_id', 'valor_fatura', 'valor', 'obs', 'status',
    ]);
    console.log('--> store', data)
    var valorFatura = data['valor_fatura']
    var valorFaturaPreparado = valorFatura.replace(",", ".");
    var valor = data['valor']
    var valorPreparado = valor.replace(",", ".");

    const pagamento = await Pagamento.create({
      user_id: data.user_id, // id do cliente
      servico_id: data.servico_id,
      fatura_id: data.fatura_id,
      metodos_pagamentos_id: data.metodos_pagamentos_id,
      valor_fatura: valorFaturaPreparado,
      valor: valorPreparado,
      obs: data.obs,
      status: data.status,
    });

    return response.status(201).json(pagamento); // retorna 201 de algo criado
  }

  async show ({ params, request, response, view }) {
    // const pagamento = await Pagamento.find(params.id)
    const pagamento = await Pagamento.query()
    .where('fatura_id', params.id)
    .fetch();
    return await pagamento;
  }

  async update ({ params, request, response }) {
    const pagamento = await Pagamento.find(params.id);
    const data = request.only([
      'user_id', 'servico_id', 'fatura_id', 'metodos_pagamentos_id', 'valor_fatura', 'valor', 'obs', 'status',
    ]);

    console.log('--> update', data)
    var valorFatura = data['valor_fatura']
    var valorFaturaPreparado = valorFatura.replace(",", ".");
    var valor = data['valor']
    var valorPreparado = valor.replace(",", ".");

    pagamento.merge({
      user_id: data.user_id, // id do cliente
      servico_id: data.servico_id,
      fatura_id: data.fatura_id,
      metodos_pagamentos_id: data.metodos_pagamentos_id,
      valor_fatura: valorFaturaPreparado,
      valor: valorPreparado,
      obs: data.obs,
      status: data.status,
    })

    await pagamento.save();

    return pagamento;
  }

  async destroy ({ params, request, response }) {
    const pagamento = await Pagamento.findByOrFail('id', params.id);
    pagamento.delete();
  }
}

module.exports = PagamentoController
