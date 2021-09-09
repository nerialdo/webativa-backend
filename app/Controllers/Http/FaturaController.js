'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Usuario = use('App/Models/User');
const Fatura = use('App/Models/Fatura');
const {format, subDays} = use('date-fns');
const Asaas = use('App/Models/Asaas/Asaas');

const Env = use('Env')
const SANDBOX_ASAAS = Env.get('SANDBOX_ASAAS')
const ACCESS_TOKEN_ASAAS_SANDBOX = Env.get('ACCESS_TOKEN_ASAAS_SANDBOX')
const ACCESS_TOKEN_ASAAS_PRODUCION = Env.get('ACCESS_TOKEN_ASAAS_PRODUCION');
/**
 * Resourceful controller for interacting with faturas
 */
class FaturaController {

  async index ({ request, response, auth }) {

    const usuario = await Usuario.find(auth.user.id)
    const roles = await usuario.getRoles()
    if(roles[0] === "admin"){

      const fatura = await Fatura.query()
      //.where('user_id', auth.user.email)
      .with('user')
      .with('servico')
      .with('pagamento')
      .orderBy('vencimento', 'desc')
      .fetch();

      return fatura;

    }else if(roles[0] === "empresa"){

      const fatura = await Fatura.query()
      .where('user_id', auth.user.id)
      .with('user')
      .with('servico')
      .with('pagamento')
      .orderBy('vencimento', 'desc')
      .fetch();

      return fatura;

    }else if(roles[0] === "usuario"){

      const fatura = await Fatura.query()
      .where('user_id', auth.user.id)
      .with('user')
      .with('servico')
      .with('pagamento')
      .orderBy('vencimento', 'desc')
      .fetch();

      return fatura;

    }

  }

  async store ({ request, response }) {

    const data = request.only([
      'user_id', 'servico_id', 'servico_cliente_id', 'id_integracao', 'vencimento', 'valor', 'link_fartura', 'link_fartura_aux', 'obs', 'status', 'cpfCnpj'
    ]);

    console.log('data store fatura', data)

    const dataCliente = {
      'cpfCnpj' : data.cpfCnpj
    }

    // //buscar cliente no asaas
    // let access_token = ""
    // access_token = '8d695fbb569a6e3a5e7269fee1a437a2a78db7d10abfce52c8b1dd5da6c99966'
    // var retorno = await Asaas.consultarCliente(access_token, dataCliente);
    // console.log("retorno verficar cliente ", retorno)

    // const qtoClienteAsaas = retorno.data.length;
    // console.log("qtoClienteAsaas", qtoClienteAsaas)
    
    // async function criarCobrancasAsaas(data, elementServico, mesAnoRef){
    //   let access_token = ""
    //   access_token = '8d695fbb569a6e3a5e7269fee1a437a2a78db7d10abfce52c8b1dd5da6c99966'
    //   var retorno = await Asaas.criarCobranca(access_token, data, elementServico);
    //   // console.log('Criando cobrança asaas retorno', retorno)
    //   salavarCobranca(retorno, elementServico, mesAnoRef)
    // }

    //buscar o dia atual
    const dataAtual = format(new Date(data.vencimento), "yyyy-MM-dd HH:mm:ss")
    const mesRef = format(new Date(dataAtual), "MM")
    const anoRef = format(new Date(dataAtual), "yyyy")
    // console.log("Criando fatura", dataAtual, mesRef, anoRef)

    var valor = data['valor']
    // var valorPreparado = valor.replace(",", ".");

    const fatura = await Fatura.create({
      user_id: data.user_id, // id do cliente
      servico_id: data.servico_id,
      servico_cliente_id: data.servico_cliente_id,
      id_integracao: data.id_integracao,
      mes_referencia: mesRef,
      ano_referencia: anoRef,
      vencimento: data.vencimento,
      valor: valor,
      link_fartura: data.link_fartura,
      link_fartura_aux: data.link_fartura_aux,
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

  async update ({ params, request, response, auth }) {

    const usuario = await Usuario.find(auth.user.id)
    const roles = await usuario.getRoles()
    if(roles[0] === "admin"){

      const fatura = await Fatura.find(params.id);

      let data = request.only([
        'data_pagamento', 'valor_liquido', 'metodo_pagamento', 'status', 'obs',
      ]);
      console.log("Update fatura", data)

      // var data_pagamento = data['data_pagamento']
      // var valorPreparado = valor.replace(",", ".");

      fatura.merge({
        data_pagamento: data['data_pagamento'],
        valor_liquido: data['valor_liquido'],
        metodo_pagamento: data['metodo_pagamento'],
        status: data['status'],
        obs: data['obs']
      })

      await fatura.save();

      return fatura;

    }

  }

  async destroy ({ params, request, response, auth}) {
    const usuario = await Usuario.find(auth.user.id)
    const roles = await usuario.getRoles()
    if(roles[0] === "admin"){
      const fatura = await Fatura.findByOrFail('id', params.id);
      const faturaJson = fatura.toJSON();
      if(faturaJson.id_integracao){
        console.log('deletando fatura, com integração', faturaJson.id_integracao)
        deletandoAsaas(faturaJson.id_integracao)
      }else{
        console.log('deletando fatura sem integração', fatura.toJSON())
        fatura.delete();
      }
      
      async function deletandoAsaas(id){
        let access_token = ""
        access_token = SANDBOX_ASAAS ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
        // var id = 'pay_6152857367477791'
        var retorno = await Asaas.deletarCobranca(access_token, id);
        console.log('returno asaas 2', retorno)
        if(retorno.deleted){
          return fatura.delete();
        }else{
          return 204;
        }
      }
    }
  }
}

module.exports = FaturaController
