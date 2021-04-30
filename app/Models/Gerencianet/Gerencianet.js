'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const config = use('App/Models/Gerencianet/Utils');
const {Configuracoes} = use('App/Models/Gerencianet/Config');
var fs = use("fs");
const Helpers = use('Helpers');
const https = use("https");
const axios = require('axios');

class Gerencianet extends Model {

	static criarCobranca(body, token) {
		// console.log("Configuracoes().pix_url_cob + enerateTxid().generateTxid('DINAMICO')", Configuracoes().pix_url_cob + config.generateTxid('DINAMICO'))
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
      passphrase: '',
    });

		let requisicao = {
			method: 'PUT',
			url: Configuracoes().pix_url_cob + config.generateTxid('DINAMICO'),
			headers: {
				authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			httpsAgent: agent,
			data: body,
		};
		const response = axios(requisicao)
			.then((response) => {
				console.log('response criarCobranca', response);
				return response.data;
			})
			.catch((error) => {
				console.log("Error criarCobranca", error);
				return error.response.data
			});

		return response;
	}

  static criarCobrancaImediata(body, token) {
		// var config = Config.Configuracoes();
    // console.log("criarCobrancaImediataq", body, token)
    // console.log("criarCobrancaImediataq", Configuracoes().pix_url_cob)

		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
      passphrase: '',
    });

		let requisicao = {
			method: 'POST',
			url: Configuracoes().pix_url_cob,
			headers: {
				authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			httpsAgent: agent,
			data: body,
		};
		const response = axios(requisicao)
			.then((response) => {
				// console.log('response', response.data);
				return response.data;
			})
			.catch((error) => {
				// console.log(error);
				console.log(error.response.data);
			});
		return response;
	}


	static consultarCobranca(token, txid) {
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
      passphrase: '',
    });

		let requisicao = {
			method: 'GET',
			url: Configuracoes().pix_url_cob + txid,
			headers: {
				authorization: 'Bearer ' + token,
			},
			httpsAgent: agent,
		};

		const response = axios(requisicao)
			.then((response) => {
				// console.log('response consultarCobranca', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;
	}

	static gerarQrCode(token, idLocation, body = []) {
		console.log("params.idlocation", idLocation)
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
      passphrase: '',
    });

		let requisicao = {
			method: 'GET',
			url: Configuracoes().location_url + idLocation + '/qrcode',
			headers: {
				authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			httpsAgent: agent,
			data: body,
		};

		const response = axios(requisicao)
			.then((response) => {
				// console.log('response gerarQrCode', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;
	}

	static configurarWebhookPix(token, chave, webhookUrl) {
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
      passphrase: '',
    });

		let requisicao = {
			method: 'PUT',
			url: Configuracoes().webhook_url + chave,
			headers: {
				authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			httpsAgent: agent,
			data: {
				webhookUrl: webhookUrl,
			},
		};

		const response = axios(requisicao)
			.then()
			.catch((error) => {
				console.log(error.response.data);
			});

		return response.data;
	}

	static listarChavesPix(token) {
		console.log(Configuracoes().url_base)
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
      passphrase: '',
    });

		let requisicao = {
			method: 'GET',
			url: Configuracoes().url_base + '/v2/gn/evp',
			headers: {
				authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			httpsAgent: agent,
			// data: body,
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response listarChavesPix', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;
	}

	static criarChavePix(token) {
		console.log(Configuracoes().url_base)
		console.log(Configuracoes().caminho_certificado)
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
      passphrase: '',
    });

		let requisicao = {
			method: 'POST',
			url: Configuracoes().url_base + '/v2/gn/evp',
			headers: {
				authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			httpsAgent: agent,
			// data: body,
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response criarChavePix', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;
	}

	static configurarWebhookPix(token, chave, webhookUrl) {
		// console.log("aqui configurarWebhookPix", token, chave, webhookUrl)
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
      passphrase: '',
    });

		let requisicao = {
			method: 'PUT',
			url: Configuracoes().webhook_url + chave,
			headers: {
				authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
				'x-skip-mtls-checking': true,
			},
			httpsAgent: agent,
			data: {
				webhookUrl: webhookUrl,
			},
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response configurarWebhookPix', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;

	}

	static consultarListaWebhooks(token, inicio, fim) {
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
      passphrase: '',
    });

		let params = '';

		if (!inicio || !fim)
			throw "Os filtros 'inicio' e 'fim' são OBRIGATÓRIOS e devem ser informados na chamada da function";
		else params += '?inicio=' + inicio + '&fim=' + fim;

		let requisicao = {
			method: 'GET',
			url: Configuracoes().webhook_url + params,
			headers: {
				authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			httpsAgent: agent,
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response consultarListaWebhooks', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;
	}

	static cancelarWebhookPix(token, chave, webhookUrl) {
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
      passphrase: '',
    });

		let requisicao = {
			method: 'DELETE',
			url: Configuracoes().webhook_url + chave,
			headers: {
				authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			httpsAgent: agent,
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response cancelarWebhookPix', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;
	}


	static retornoChamadaWebHook(token) {
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
			ca: fs.readFileSync(Helpers.resourcesPath('chain-pix-prod.crt')),   // Certificado público da Gerencianet
      passphrase: '',
    });

		let requisicao = {
			method: 'POST',
			url: Configuracoes().webhook_url + chave,
			headers: {
				authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			httpsAgent: agent,
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response cancelarWebhookPix', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;
	}


	static listarCobrancas(token, inicio, fim, cpf, cnpj, status, itensPorPagina, paginaAtual) {
		console.log("listarCobrancas")
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado, // Certificado público da Gerencianet
      passphrase: '',
    });


		let params = '';

		if (!inicio || !fim)
			throw "Os filtros 'inicio' e 'fim' são OBRIGATÓRIOS e devem ser informados na chamada da function";
		else params += '?inicio=' + inicio + '&fim=' + fim;

		if (cpf && cnpj) {
			throw "O filtro 'cpf' não pode ser utilizado ao mesmo tempo que o 'CNPJ'";
		}
		if (cpf) params += '&cpf=' + cpf;
		if (cnpj) params += '&cnpj=' + cnpj;

		let vetStatus = ['ATIVA', 'CONCLUIDA', 'REMOVIDA_PELO_USUARIO_RECEBEDOR', 'REMOVIDA_PELO_PSP'];
		if (status) {
			if (!vetStatus.includes(status))
				throw "O filtro 'status' informado é inválido. O parâmetro somente deve conter um dos seguintes valores: ['ATIVA', 'CONCLUIDA', 'REMOVIDA_PELO_USUARIO_RECEBEDOR', 'REMOVIDA_PELO_PSP']";
			params += '&status=' + status;
		}

		if (itensPorPagina <= 0) throw "O filtro 'itensPorPagina' deve ser um número entre 1 e 1000";
		if (paginaAtual < 0) throw "O filtro 'paginaAtual' deve ser um número maior ou igual a 0";

		if (itensPorPagina) params += '&itensPorPagina=' + itensPorPagina;

		if (paginaAtual) params += '&paginaAtual=' + paginaAtual;

		console.log("params", params)

		var requisicao = {
			method: 'GET',
			url: Configuracoes().pix_url_cob + params,
			headers: {
				authorization: 'Bearer ' + token,
			},
			httpsAgent: agent,
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response listarCobrancas', response.data);
				return response.data;
			})
			.catch((error) => {
				// console.log(error);
				console.log(error.response.data);
			});

		return response;
	}

	static consultarPixRecebidos(
		token,
		inicio,
		fim,
		cpf,
		cnpj,
		itensPorPagina,
		paginaAtual,
		txid,
		txIdPresente,
		devolucaoPresente
	) {
		console.log("consultarPixRecebidos")
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado, // Certificado público da Gerencianet
      passphrase: '',
    });
		let params = '';

		if (!inicio || !fim)
			throw "Os filtros 'inicio' e 'fim' são OBRIGATÓRIOS e devem ser informados na chamada da function";
		else params += '?inicio=' + inicio + '&fim=' + fim;

		if (cpf && cnpj) throw "O filtro 'cpf' não pode ser utilizado ao mesmo tempo que o 'CNPJ'";
		if (cpf) params += '&cpf=' + cpf;
		if (cnpj) params += '&cnpj=' + cnpj;
		if (itensPorPagina) params += '&itensPorPagina=' + itensPorPagina;
		if (paginaAtual) params += '&paginaAtual=' + paginaAtual;
		if (txid) params += '&txid=' + txid;
		if (txIdPresente) params += '&txIdPresente=' + txIdPresente;
		if (devolucaoPresente) params += '&devolucaoPresente=' + devolucaoPresente;

		console.log("params", params)

		var requisicao = {
			method: 'GET',
			url: Configuracoes().pix_url + params,
			headers: {
				authorization: 'Bearer ' + token,
			},
			httpsAgent: agent,
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response listarCobrancas', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;
	}

	static consultarPIX(token, e2eId) {
		var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado, // Certificado público da Gerencianet
      passphrase: '',
    });

		let requisicao = {
			method: 'GET',
			url: Configuracoes().pix_url + e2eId,
			headers: {
				authorization: 'Bearer ' + token,
			},
			httpsAgent: agent,
		};

		const response = axios(requisicao)
			.then((response) => {
				console.log('response consultarPIX', response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error.response.data);
			});

		return response;
	}


}

module.exports = Gerencianet
