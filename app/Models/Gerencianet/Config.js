'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Utils = use('App/Models/Gerencianet/Utils');
const Env = use('Env');
const Helpers = use('Helpers');
const https = use("https");
var fs = use("fs");

class Config extends Model {

  static Configuracoes() {

    var sandbox = false;

    if (sandbox) {
			return {
				'caminho_certificado': 'homologacao-certificado.p12',
				'client_id': Env.get('client_id_DESENVOLVIMENTO'),
				'client_secret': Env.get('client_secret_DESENVOLVIMENTO'),
				'url_base': 'https://api-pix-h.gerencianet.com.br/',
				'pix_url_auth': 'https://api-pix-h.gerencianet.com.br/oauth/token',
				'pix_url_cob': 'https://api-pix-h.gerencianet.com.br/v2/cob/',
				'pix_url': 'https://api-pix-h.gerencianet.com.br/v2/pix/',
				'webhook_url': 'https://api-pix-h.gerencianet.com.br/v2/webhook/',
				'location_url': 'https://api-pix-h.gerencianet.com.br/v2/loc/',
			}
			// //Insira o caminho do seu certificado de DESENVOLVIMENTO
			// this.caminho_certificado = 'homologacao-certificado.p12';
			// //Insira sua client_id de DESENVOLVIMENTO
			// this.client_id = Env.get('client_id_DESENVOLVIMENTO');
			// //Insira sua client_secret de DESENVOLVIMENTO
			// this.client_secret = Env.get('client_secret_DESENVOLVIMENTO');

			// this.url_base = 'https://api-pix-h.gerencianet.com.br/';
			// this.pix_url_auth = 'https://api-pix-h.gerencianet.com.br/oauth/token';
			// this.pix_url_cob = 'https://api-pix-h.gerencianet.com.br/v2/cob/';
			// this.pix_url = 'https://api-pix-h.gerencianet.com.br/v2/pix/';
			// this.webhook_url = 'https://api-pix-h.gerencianet.com.br/v2/webhook/';
			// this.location_url = 'https://api-pix-h.gerencianet.com.br/v2/loc/';
		} else {
			return {
				'caminho_certificado': 'producao-certificado.p12',
				'client_id': Env.get('client_id_PRODUCAO'),
				'client_secret': Env.get('client_secret_PRODUCAO'),
				'url_base': 'https://api-pix.gerencianet.com.br',
				'pix_url_auth': 'https://api-pix.gerencianet.com.br/oauth/token',
				'pix_url_cob': 'https://api-pix.gerencianet.com.br/v2/cob/',
				'pix_url': 'https://api-pix.gerencianet.com.br/v2/pix/',
				'webhook_url': 'https://api-pix.gerencianet.com.br/v2/webhook/',
				'location_url': 'https://api-pix.gerencianet.com.br/v2/loc/',
			}
			// //Insira o caminho do seu certificado de PRODUÇÃO
			// this.caminho_certificado = Env.get('caminho_certificado_PRODUCAO');
			// //Insira sua client_id de PRODUÇÃO
			// this.client_id = Env.get('caminho_certificado_PRODUCAO');
			// //Insira sua client_secret de PRODUÇÃO
			// this.client_secret = Env.get('caminho_certificado_PRODUCAO');

			// this.url_base = 'https://api-pix.gerencianet.com.br/';
			// this.pix_url_auth = 'https://api-pix.gerencianet.com.br/oauth/token';
			// this.pix_url_cob = 'https://api-pix.gerencianet.com.br/v2/cob/';
			// this.pix_url = 'https://api-pix.gerencianet.com.br/v2/pix/';
			// this.webhook_url = 'https://api-pix.gerencianet.com.br/v2/webhook/';
			// this.location_url = 'https://api-pix.gerencianet.com.br/v2/loc/';
		}

		// var certificado = fs.readFileSync(Helpers.resourcesPath(this.caminho_certificado));
		// this.data_credentials = this.client_id + ':' + this.client_secret;
		// this.agent = new https.Agent({
		// 	pfx: certificado,
		// 	passphrase: '',
		// });
	}
}

module.exports = Config
