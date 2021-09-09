'use strict'
let requeste = require('request');
let urlApi = 'https://sandbox.asaas.com';
const {addDays, format, parseISO} = use('date-fns')
const Asaas = use('App/Models/Asaas/Asaas');
const Fatura = use('App/Models/Fatura');
const ServicoCliente = use('App/Models/ServicoCliente');
const Env = use('Env')
const SANDBOX_ASAAS = Env.get('SANDBOX_ASAAS')
const ACCESS_TOKEN_ASAAS_SANDBOX = Env.get('ACCESS_TOKEN_ASAAS_SANDBOX')
const ACCESS_TOKEN_ASAAS_PRODUCION = Env.get('ACCESS_TOKEN_ASAAS_PRODUCION');

//envio de email
const User = use('App/Models/User');
const Send = use('App/Models/Send');
const client = require('twilio')();
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const view = use('View');

class AsaasController {

  async consultarCliente  ({ params, request, response }) {
    let data = {'cpfCnpj' : params.cpf_cnpj}
    console.log("data consultarCliente", data)
    let access_token = ""
    // access_token = '8d695fbb569a6e3a5e7269fee1a437a2a78db7d10abfce52c8b1dd5da6c99966'
    access_token = SANDBOX_ASAAS ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
    var retorno = await Asaas.consultarCliente(access_token, data);
    return retorno;

  }

  async consultarParcelamento  ({ params, request, response }) {
    let data = {'installment_id' : params.installment_id}
    console.log("data consultarParcelamento", data)
    let access_token = ""
    access_token = SANDBOX_ASAAS ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
    var retorno = await Asaas.consultarParcelamento(access_token, data);
    return retorno;
  }
  
  async cadastrarCliente  ({ request, response }) {
  
    let dados = request.all();
    var data = {
      'name': dados.name,
      'email': dados.email,
      'phone': dados.telefone,
      'mobilePhone': dados.whatsapp,
      'address': dados.rua,
      'addressNumber': dados.numero,
      'complement': '',
      'province': dados.bairro,
      'postalCode': dados.cep,
      'cpfCnpj': dados.cpf_cnpj,
      'personType': 'FISICA',
      'city': dados.cidade,
      'state': dados.estado,
      'country': dados.pais,
      'observations': '',
    }
    // console.log("Cadastrando cliente no asaas ", data)
    let access_token = ""
    access_token = SANDBOX_ASAAS ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
    var retorno = await Asaas.cadastrarCliente(access_token, data);
    // console.log('Criando um novo cliente asaas retorno', retorno)
    return retorno
  }

  async deletarCobranca  ({params, request, response }) {
    let access_token = ""
    access_token = SANDBOX_ASAAS ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
    var id = 'pay_6152857367477791'
    var retorno = await Asaas.deletarCobranca(access_token, id);
    return retorno;
  }


  async cobrancaUnica  ({params, request, response }) {
    let dados = request.all();
    console.log("dados criarCobranca", dados)
    var data = {
      "id": dados.customer, // identeificação do cliente asaas
      "billingType": dados.billingType,
      // "value" :{
      //   'elementServico': dados.value
      // } ,
      // "description": dados.description,
      "externalReference": dados.externalReference, // id do serviço
      "primeiroPagamento": dados.primeiroPagamento,
      // "dominio": ''
    }
    var elementServico = {
      'valor':dados.value,
      'description': dados.description,
      'servico': {
        'id': dados.externalReference,
        'nome': dados.nomeServico
      }
    }
 
    let access_token = ""
    access_token = SANDBOX_ASAAS ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
    var id = 'pay_6152857367477791'
    var retorno = await Asaas.criarCobranca(access_token, data, elementServico);

    // await Send.cobrancaUnica(retorno)

    return retorno;
  }
  

  async cobrancaParcelada  ({params, request, response }) {
    let dados = request.all();
    console.log("dados cobrancaParcelada", dados)
    var data = {
      "customer": dados.customer,
      "billingType": "BOLETO",
      "installmentCount" : dados.installmentCount,
      "installmentValue": dados.installmentValue,
      // "totalValue": dados.totalValue,
      "description": dados.description,
      "externalReference": dados.externalReference, // id do serviço
      "primeiroPagamento": dados.primeiroPagamento
    }
    let access_token = ""
    access_token = SANDBOX_ASAAS ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
    var id = 'pay_6152857367477791'
    var retorno = await Asaas.cobrancaParcelada(access_token, data);
    console.log("retorno cobrancaParcelada ", retorno)
    return retorno;
  }

    

  async confirmaPagamentoDinheiro  ({params, request, response }) {
    let dados = request.all();
    console.log("dados confirmaPagamentoDinheiro", dados)
    var data = {
      "id": params.id,
      "value": dados.value,
    }
    let access_token = ""
    access_token = SANDBOX_ASAAS ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
    var retorno = await Asaas.confirmaPagamentoDinheiro(access_token, data);
    console.log("retorno confirmaPagamentoDinheiro ", retorno)
    return retorno;
  }

  

  async retornoWebHook ({ params, request, response, auth }) {
    var body = request.body;
    const event = body.event;
    const payment = body.payment
    console.log("event", event, payment.id)
    const dataAtual = format(new Date(), "yyyy-MM-dd") 
    // return 200
    switch (event) {
      case 'PAYMENT_CREATED':
        console.log('Fatura Criada')
        return 200
      case 'PAYMENT_RECEIVED':
        console.log('Buscar fatura Fatura')
        const fatura = await Fatura.findByOrFail('id_integracao', payment.id);
        fatura.merge({
          data_pagamento: dataAtual,
          valor_liquido: payment.netValue, 
          metodo_pagamento: payment.billingType,
          status: 2,
        })
        await fatura.save();
        // enviar email para cliente de fatura paga
        const jsonFatura = fatura.toJSON()
        console.log('editou fatura ', jsonFatura)
        editarProximoVencimento(jsonFatura.servico_cliente_id)
        return 200
      default:
        return 200
    }
    // editar data do proxímo vencimento
    async function editarProximoVencimento(id){
      try {
        console.log('dia add  id', id)
        const servicoCliente = await ServicoCliente.find(id);
        const jsonServicoCliente = servicoCliente.toJSON()
        var data_proximo_pagamento =jsonServicoCliente.data_proximo_pagamento;
        var proximoPagamento = format(addDays(new Date(data_proximo_pagamento), 31), "yyyy-MM-dd")
        console.log('jsonServicoCliente ', jsonServicoCliente, jsonServicoCliente.data_proximo_pagamento)
        console.log('dia add  ', proximoPagamento)
        
        servicoCliente.merge({
          data_proximo_pagamento: proximoPagamento,
        })
        await servicoCliente.save();

        //envia email para o cliente de fatura paga
        // em breve
        
      } catch (error) {
        console.log('dia add  error', error)
      }
    }
    // // Event.fire('new::pixRecebido', body)
  }
}

module.exports = AsaasController
