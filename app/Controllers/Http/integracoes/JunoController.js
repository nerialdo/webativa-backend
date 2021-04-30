'use strict'

const axios = use('axios')

class JunoController {
  async integra ({ request, response, auth }) {

    const restorno = axios.get(`https://sandbox.boletobancario.com/authorization-server`)
    return restorno
  }
}

module.exports = JunoController
