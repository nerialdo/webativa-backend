'use strict'
var Gerencianet = require('gn-api-sdk-node');
// const Cliente = use('App/Models/User');
const GerencianetModel = use('App/Models/Gerencianet/Gerencianet');
const Utils = use('App/Models/Gerencianet/Utils');
const https = use("https");
var axios = use("axios");
var fs = use("fs");
const Helpers = use('Helpers');
const Event = use('Event')

class GerencianetController {

  async criarCobracaPix ({ request, response }) {

    let data = request.only([
      'cpf', 'nome', 'valor'
    ]);

    console.log("data criarCobracaPix", data)

    var valor = data.valor;
    let result = valor.includes('.');
    if(!result){
      valor = valor+'.00'
    }
    console.log("data criarCobracaPix", valor)
    var cpfReplace = data.cpf.replace(/\D+/g, '')
    console.log("data cpfReplace", cpfReplace)
    let body = {
      "calendario": {
        "expiracao": 3600
      },
      "devedor": {
        "cpf": cpfReplace,
        "nome": data.nome
      },
      "valor": {
        "original": valor.toString()
      },
      "chave": "4196a44f-9bb6-4c6a-9082-9ef71480a82a",
      "solicitacaoPagador": "Informe alguma identificação (CPF ou Telefone)"
    }
    let token = ""
    token = await Utils.gerarToken()
    // console.log("Token ", token)
    var criarPix = await GerencianetModel.criarCobranca(body, token);
    console.log("criarPix", criarPix)
    return criarPix;
  }

  async criarCobracaImediataPix ({ request, response }) {

    let body = {
      "calendario": {
          "expiracao": 3600
      },
      "devedor": {
          "cpf": "12345678909",
          "nome": "Francisco da Silva"
      },
      "valor": {
          "original": "123.45"
      },
      "chave": "+5522999486347",
      "solicitacaoPagador": "Informe alguma identificação (CPF ou Telefone)"
    }
    let token = ""
    token = await Utils.gerarToken()
    // console.log("Token ", token)
    var criarPix = await GerencianetModel.criarCobrancaImediata(body, token);
    return criarPix;

  }

  async consultarCobrancaPix ({ request, response }) {
    let token = ""
    token = await Utils.gerarToken()
    let txid = ""
    txid = '38aa0e7a154649208a8c4fba36db6924'
    var retorno = await GerencianetModel.consultarCobranca(token, txid);
    return retorno;

  }

  async gerarQRCodeCobrancaPix ({ request, response, params}) {
    let token = ""
    token = await Utils.gerarToken()
    let idlocation = ""
    idlocation = params.idlocation
    var retorno = await GerencianetModel.gerarQrCode(token, idlocation);
    return retorno;

  }

  async criarChaveUsoPix ({ request, response }) {
    let token = ""
    token = await Utils.gerarToken()
    var retorno = await GerencianetModel.criarChavePix(token);
    return retorno;

  }

  async listarChavesUsoPix ({ request, response }) {
    console.log("aqui")
    let token = ""
    token = await Utils.gerarToken()
    var retorno = await GerencianetModel.listarChavesPix(token);
    return retorno;

  }

  async configurarWebhookUsoPix ({ request, response }) {
    console.log("aqui configurarWebhookUsoPix")
    let token = ""
    token = await Utils.gerarToken()
    let chave = '4196a44f-9bb6-4c6a-9082-9ef71480a82a'
    let webhookUrl = 'https://2481c29a5715.ngrok.io/webhook'
    var retorno = await GerencianetModel.configurarWebhookPix(token, chave, webhookUrl);
    return retorno;
  }

  async consultarListaWebhooksUsoPix() {
    let token = ""
    token = await Utils.gerarToken()
    let inicio = '2021-01-22T16:01:35Z'
    let fim = '2021-10-23T16:01:35Z'
		var retorno = await GerencianetModel.consultarListaWebhooks(token, inicio, fim);
    return retorno;
	}

  async cancelarWebhookPixUsoPix() {
    let token = ""
    token = await Utils.gerarToken()
    let chave = '4196a44f-9bb6-4c6a-9082-9ef71480a82a'
    let webhookUrl = 'https://2481c29a5715.ngrok.io/webhook'
		var retorno = await GerencianetModel.cancelarWebhookPix(token, chave, webhookUrl);
    return retorno;
	}


  async retornoWebHook ({ params, request, response }) {
    return false
  }

  async retornoWebHookPix ({ params, request, response, auth }) {
    console.log("retornoWebHookPix", request)
    var body = request.body;
    console.log("body", body)
    Event.fire('new::pixRecebido', body)
  }


  async listarCobrancasUsoPix() {
    console.log("listarCobrancasUsoPix")
    let token = ""
    token = await Utils.gerarToken()
    let inicio = '2021-01-22T16:01:35Z'
    let fim = '2021-10-23T16:01:35Z'
		var retorno = await GerencianetModel.listarCobrancas(token, inicio, fim);
    return retorno;
	}

  async consultarPixRecebidosUsoPix() {
    console.log("consultarPixRecebidosUsoPix")
    let token = ""
    token = await Utils.gerarToken()
    let inicio = '2021-01-22T16:01:35Z'
    let fim = '2021-10-23T16:01:35Z'
		var retorno = await GerencianetModel.consultarPixRecebidos(token, inicio, fim);
    return retorno;
	}

  async consultarPIXUsoPix() {
    console.log("consultarPIXUsoPix")
    let token = ""
    token = await Utils.gerarToken()
    let e2eId = 'E18236120202104202133s0952095DRB'
		var retorno = await GerencianetModel.consultarPIX(token, e2eId);
    return retorno;
	}


  async retorno ({ params, request, response, auth }) {
    let data = request.only([''])
    console.log("========================================= retorno", data)
    return true
  }
}

module.exports = GerencianetController
