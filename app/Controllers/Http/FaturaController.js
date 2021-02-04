'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Fatura = use('App/Models/Fatura');
const {format, subDays} = use('date-fns')
/**
 * Resourceful controller for interacting with faturas
 */
class FaturaController {

  async index ({ request, response, view }) {
    const fatura = await Fatura.query()
    //.where('user_id', auth.user.email)
    .with('user')
    .with('servico')
    .with('pagamento')
    .orderBy('vencimento', 'asc')
    .fetch();

    return fatura;
  }

  async store ({ request, response }) {
    const data = request.only([
      'user_id', 'servico_id', 'servico_clientes_id', 'vencimento', 'valor', 'obs', 'status',
    ]);

    console.log("data cadastro", data)

    //buscar o dia atual
    const dataAtual = format(new Date(), "yyyy-MM-dd HH:mm:ss")
    const mesRef = format(new Date(dataAtual), "MM")
    const anoRef = format(new Date(dataAtual), "yyyy")

    var valor = data['valor']
    // var valorPreparado = valor.replace(",", ".");

    const fatura = await Fatura.create({
      user_id: data.user_id, // id do cliente
      servico_id: data.servico_id,
      servico_clientes_id: data.servico_clientes_id,
      mes_referencia: mesRef,
      ano_referencia: anoRef,
      vencimento: data.vencimento,
      valor: valor,
      obs: data.obs,
      status: data.status,
    });

    return response.status(201).json(fatura); // retorna 201 de algo criado
  }

  async show ({ params, request, response, view }) {
    const fatura = await Fatura.query()
    .with('user')
    .with('servico')
    .with('pagamento')
    .where('id', params.id)
    .fetch();
    return await fatura;
  }

  async update ({ params, request, response }) {

    const fatura = await Fatura.find(params.id);

    let data = request.only([
      'data_pagamento', 'status', 'obs'
    ]);
    console.log("Update fatura", data)

    // var data_pagamento = data['data_pagamento']
    // var valorPreparado = valor.replace(",", ".");

    fatura.merge({
      data_pagamento: data['data_pagamento'],
      status: data['status'],
      obs: data['obs']
    })

    await fatura.save();

    return fatura;
  }

  async destroy ({ params, request, response }) {
    const fatura = await Fatura.findByOrFail('id', params.id);
    fatura.delete();
  }
}

module.exports = FaturaController
