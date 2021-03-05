'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const ServicoCliente = use('App/Models/ServicoCliente');
const User = use('App/Models/User');
/**
 * Resourceful controller for interacting with servicoclientes
 */
// const { format, parseISO } = use('date-fns');
const moment = use('moment');

class ServicoClienteController {

  async index ({ request, response, params, auth }) {
    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()
    if(roles[0] === "admin"){
      const servicoCliente = await ServicoCliente.query()
      .with('servico')
      // .where('id', params.user)
      .where('user_id', params.user)
      .orderBy('id', 'desc')
      .fetch();

      return servicoCliente;
    } else if(roles[0] === 'empresa'){

    } else if(roles[0] === "usuario"){
      const servicoCliente = await ServicoCliente.query()
      .with('servico')
      // .where('id', params.user)
      .where('user_id', auth.user.id)
      .orderBy('id', 'desc')
      .fetch();

      return servicoCliente;
    }

  }

  async store ({ request, response, auth }) {
    const data = request.only([
      'user_id',
      'servico_id',
      'valor',
      'dias_carencia',
      'data_primeiro_pagamento',
      'data_proximo_pagamento',
      'parcelas',
      'valor_parcela',
      'dominio',
      'info_add',
      'status'
    ]);
    // console.log("cadastrando", data)
    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()
    if(roles[0] === "admin"){
      if(data['parcelas'] == 1){
        console.log("parcelas cadastro", data['parcelas'], typeof data['parcelas'] )
        const servicoCliente = await ServicoCliente.create({
          user_id: data['user_id'], // id do cliente
          servico_id: data['servico_id'],
          valor: data['valor'],
          dias_carencia: data['dias_carencia'],
          data_primeiro_pagamento: data['data_primeiro_pagamento'],
          data_proximo_pagamento: data['data_proximo_pagamento'],
          parcelas: data['parcelas'],
          valor_parcela: data['valor_parcela'],
          dominio: data['dominio'],
          info_add: data['info_add'],
          status: data['status'],
        });

        return response.status(201).json(servicoCliente); // retorna 201 de algo criado
      }else{
        const servicoCliente = await ServicoCliente.create({
          user_id: data['user_id'], // id do cliente
          servico_id: data['servico_id'],
          valor: data['valor'],
          dias_carencia: data['dias_carencia'],
          data_primeiro_pagamento: data['data_primeiro_pagamento'],
          data_proximo_pagamento: data['data_proximo_pagamento'],
          parcelas: data['parcelas'],
          valor_parcela: data['valor_parcela'],
          dominio: data['dominio'],
          info_add: data['info_add'],
          status: data['status'],
        });

        return response.status(201).json(servicoCliente); // retorna 201 de algo criado
      }

    }
  }

  async show ({ params, request, response, auth }) {
    console.log("aqui show", params.id)
    const servicoCliente = await ServicoCliente.query()
      .with('servico')
      .where('id', params.id)
      .fetch()

      return servicoCliente;
  }

  async update ({ params, request, response, auth }) {
    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()
    if(roles[0] === "admin"){
      const servicoCliente = await ServicoCliente.find(params.id);

      const data = request.only([
        'servico_id', 'valor', 'dias_carencia', 'data_primeiro_pagamento', 'data_proximo_pagamento', 'dominio', 'info_add', 'status'
      ]);
      console.log('editando...',data)
      servicoCliente.merge({
        user_id: auth.user.id, // id do cliente
        servico_id: data['servico_id'],
        valor: data['valor'],
        dias_carencia: data['dias_carencia'],
        data_primeiro_pagamento: data['data_primeiro_pagamento'],
        data_proximo_pagamento: data['data_proximo_pagamento'],
        dominio: data['dominio'],
        info_add: data['info_add'],
        status: data['status'],
      })

      await servicoCliente.save();

      return servicoCliente;
    }
  }

  async destroy ({ params, request, response }) {
    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()
    if(roles[0] === "admin"){
      const servicoCliente = await ServicoCliente.findByOrFail('id', params.id);
      servicoCliente.delete();
    }
  }
}

module.exports = ServicoClienteController
