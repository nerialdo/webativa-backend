'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
var fs = use("fs");
const Helpers = use('Helpers');
const https = use("https");
const axios = require('axios');
const Env = use('Env')
const SANDBOX_ASAAS = Env.get('SANDBOX_ASAAS')
let urlApi = SANDBOX_ASAAS === 'true' ? 'https://sandbox.asaas.com' : 'https://www.asaas.com';
const {parse, addDays, format, parseISO, formatISO, isLastDayOfMonth} = use('date-fns');
const { enGB } = use( 'date-fns/locale')

class Asaa extends Model {
  static consultarCliente(access_token, data) {
    // console.log("access_token, access_token", access_token, data.cpfCnpj)
		let requisicao = {
			method: 'GET',
      url: urlApi +'/api/v3/customers?&cpfCnpj='+data.cpfCnpj,
			headers: {
        'access_token': access_token,
        'Content-Type':'application/json'
			},
		};

		const response = axios(requisicao)
			.then((response) => {
				// console.log('response consultarCliente', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;
	}

  static consultarParcelamento(access_token, data) {
		let requisicao = {
			method: 'GET',
      url: urlApi +'/api/v3/payments?&installment='+data.installment_id,
			headers: {
        'access_token': access_token,
        'Content-Type':'application/json'
			},
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response consultarParcelamento', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;
	}


  static cadastrarCliente(access_token, data) {
    // console.log('access_token, data', access_token, data, data.name)
    var dadosInsert = {
      "name": data.name,
      "email": data.email,
      "phone": data.phone,
      "mobilePhone": data.mobilePhone,
      "cpfCnpj": data.cpfCnpj,
      "postalCode": data.postalCode,
      "address": data.address,
      "addressNumber": data.addressNumber,
      "complement": data.complement,
      "province": data.province,
      "externalReference": data.externalReference,
      "notificationDisabled": true,
      "additionalEmails": "",
      "municipalInscription": "",
      "stateInscription": "",
      "observations": "",
      "groupName" : "WebAtiva Hospedagem"
    }

    // console.log('dadosInsert', JSON.stringify(dadosInsert))

    let requisicao = {
			method: 'POST',
      url: urlApi +'/api/v3/customers',
			headers: {
        'Content-Type':'application/json',
        'access_token': access_token,
			},
      // body: JSON.stringify(dadosInsert)
      data : dadosInsert
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response Criando cliente', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log('Erro ao cadastrar cliente', error.response.data);
			});

		return response;

  }

  static criarCobranca(access_token, data, elementServico) {
    // console.log("data model criarCobranca data", data)
    // console.log("data model criarCobranca elementServico", elementServico)
    const parsed = parse(data.primeiroPagamento, 'P', new Date(), { locale: enGB })
    const dataVencimento = format(parsed, 'yyyy-MM-dd')
    // console.log("customerId", data, elementServico)
    // console.log("dataVencimento", dataVencimento)

    var dadosInsert = {
      "customer": data.id, // identificação do cliente asaas
      "billingType": "UNDEFINED",
      "dueDate": dataVencimento,
      "value": elementServico.valor,
      "description": elementServico.servico.nome + ' - ' + elementServico.description,
      "externalReference": elementServico.servico.id, // id do serviço
      "discount": {
        "value": 0,
        "dueDateLimitDays": 0
      },
      "fine": {
        "value": 0
      },
      "interest": { "value": 0 },
      "postalService": false
    }

    // console.log('dadosInsert', dadosInsert)

    let requisicao = {
			method: 'POST',
      url: urlApi +'/api/v3/payments',
			headers: {
        'Content-Type':'application/json',
        'access_token': access_token,
			},
      // body: JSON.stringify(dadosInsert)
      data : dadosInsert
		};

		const response = axios(requisicao)
			.then((response) => {
				// console.log('response Criando cobrança', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log('Erro ao cadastrar cobrança', error.response.data);
			});

		return response;

  }


  static cobrancaParcelada(access_token, data) {
    console.log("customerId cobrancaParcelada", data)
    const parsed = parse(data.primeiroPagamento, 'P', new Date(), { locale: enGB })
    const dataVencimento = format(parsed, 'yyyy-MM-dd')
    // const diaVencimento = format(parsed, 'dd')
    // const eultimoDiaDoMes = isLastDayOfMonth(parsed)
    // console.log("dataAtual ", dataVencimento)
    // console.log("diaVencimento ", diaVencimento)
    // console.log("ultimoDiaMes ", eultimoDiaDoMes)
    

    var dadosInsert = {
      "customer": data.customer,
      "billingType": "BOLETO",
      "installmentCount" : data.installmentCount,
      "installmentValue": data.installmentValue,
      // "totalValue": data.totalValue,
      "dueDate": dataVencimento,
      // "value": elementServico.valor,
      "description": data.description,
      "externalReference": data.externalReference, // id do serviço
      "discount": {
        "value": 0,
        "dueDateLimitDays": 0
      },
      "fine": {
        "value": 0
      },
      "interest": { "value": 0 },
      "postalService": false
    }

    // console.log('dadosInsert', dadosInsert)

    let requisicao = {
			method: 'POST',
      url: urlApi +'/api/v3/payments',
			headers: {
        'Content-Type':'application/json',
        'access_token': access_token,
			},
      // body: JSON.stringify(dadosInsert)
      data : dadosInsert
		};

		const response = axios(requisicao)
			.then((response) => {
				// console.log('response Criando cobrança', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log('Erro ao cadastrar cobrança', error.response.data);
			});


		return response;

  }

  static confirmaPagamentoDinheiro(access_token, data) {
    console.log("customerId confirmaPagamentoDinheiro", data)
    // const parsed = parse(data.primeiroPagamento, 'P', new Date(), { locale: enGB })
    const dataAtual = format(new Date(), 'yyyy-MM-dd')


    var dadosInsert = {
      "paymentDate": dataAtual,
      "value": data.value,
    }

    // console.log('dadosInsert', dadosInsert)

    let requisicao = {
			method: 'POST',
      url: urlApi +'/api/v3/payments/'+data.id+'/receiveInCash',
			headers: {
        'Content-Type':'application/json',
        'access_token': access_token,
			},
      // body: JSON.stringify(dadosInsert)
      data : dadosInsert
		};

		const response = axios(requisicao)
			.then((response) => {
				// console.log('response Criando cobrança', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log('Erro ao confirmar recebimento de cobrança', error.response.data);
			});


		return response;

  }


  static deletarCobranca(access_token, id) {
    console.log("customerId", id)

    let requisicao = {
			method: 'DELETE',
      url: urlApi +'/api/v3/payments/'+ id,
			headers: {
        'Content-Type':'application/json',
        'access_token': access_token,
			},
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response Criando cobrança', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log('Erro ao cadastrar cobrança', error.response.data);
			});

		return response;

  }
}

module.exports = Asaa
