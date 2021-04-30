'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const axios = require('axios');
const {Configuracoes} = use('App/Models/Gerencianet/Config');
var fs = use("fs");
const Helpers = use('Helpers');
const https = use("https");
const randomstring = require('randomstring');

class Utils extends Model {
  
  static generateTxid(tipoPix) {
		switch (tipoPix.toUpperCase()) {
			case 'DINAMICO':
				return randomstring.generate({ length: 35, charset: 'alphanumeric' });
			case 'ESTATICO':
				return randomstring.generate({ length: 25, charset: 'alphanumeric' });
			default:
				throw "Parâmetro 'tipoPix' inválido. \nO Parâmetro 'tipoPix' deve ser 'DINAMICO' ou 'ESTATICO'";
		}
	}
	static gerarToken() {
    var certificado = fs.readFileSync(Helpers.resourcesPath(Configuracoes().caminho_certificado));
    var agent = new https.Agent({
      pfx: certificado,
      passphrase: '',
    });

    var data_credentials = Configuracoes().client_id + ':' + Configuracoes().client_secret;

		let auth = Buffer.from(data_credentials).toString('base64');
		const requisicao = {
			method: 'POST',
			url: Configuracoes().pix_url_auth,
			headers: {
				Authorization: 'Basic ' + auth,
				'Content-Type': 'application/json',
			},
			httpsAgent: agent,
			data: JSON.stringify({ grant_type: 'client_credentials' }),
		};

		let userToken = axios(requisicao)
			.then((response) => {
				console.log();
				return response.data.access_token;
			})
			.catch((error) => {
				console.error(error.response.data);
			});

		return userToken;
	}

}

module.exports = Utils
