'use strict'
const Utils = use('App/Models/Gerencianet/Utils');
const https = use("https");
var axios = use("axios");
var fs = use("fs");
const Helpers = use('Helpers');
const Event = use('Event');
const Mail = use('Mail')

class TwilioController {

  async retornoTwilio ({ request, response }) {
    return 'aqui'
  }
}

module.exports = TwilioController
