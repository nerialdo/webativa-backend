'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const PagamentoPix = use('App/Models/PagamentoPix');
class PagamentoPixController {

  async index ({ request, response, view }) {
    const pagamentoPix = await PagamentoPix.query()
    //.where('user_id', auth.user.email)
    .orderBy('id', 'desc')
    .fetch();

    return pagamentoPix;
  }

  async store ({ request, response, auth }) {
    const data = request.only([
      'user_id',
      'fatura_id',
      'calendario',
      'metodos_pagamentos_id',
      'horario_transferencia',
      'loc',
      'endToEndId',
      'txid',
      'chave',
      'infoPagador',
      'status',
    ]);
    console.log('-->PagamentoPix store', data)

    const pagamentoPix = await PagamentoPix.create({
      user_id: auth.user.id, // id do cliente
      fatura_id: data.fatura_id,
      calendario: data.calendario,
      horario_transferencia: data.horario_transferencia,
      loc: data.loc,
      endToEndId: data.endToEndId,
      txid: data.txid,
      chave: data.chave,
      infoPagador: data.infoPagador,
      status: 'Aberto',
    });

    return response.status(201).json(pagamentoPix); // retorna 201 de algo criado
  }

  async show ({ params, request, response, view }) {
    const pagamentoPix = await PagamentoPix.query()
    .where('fatura_id', params.id)
    .fetch();
    return await pagamentoPix;
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
    const pagamentoPix = await PagamentoPix.findByOrFail('id', params.id);
    pagamentoPix.delete();
  }
}

module.exports = PagamentoPixController
