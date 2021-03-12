'use strict'

class SessionController {
  async store({ request, response, auth }) {
    response.header('Content-type', 'application/json')
    response.header('Access-Control-Allow-Origin', '*')
    const { email, password } = request.only(['email', 'password']);

    const { token } = await auth.attempt(email, password);

    return { token };
  }
}

module.exports = SessionController
