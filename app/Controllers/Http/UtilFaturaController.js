'use strict'
const Fatura = use('App/Models/Fatura');
const {format, subDays} = use('date-fns')

class UtilFaturaController {
  async faturasVencidas ({ request, response, view }) {
    const fatura = await Fatura.query()
    //.where('user_id', auth.user.email)
    .with('user')
    .with('servico')
    .with('pagamento')
    .where('status', 1)
    .orderBy('id', 'desc')
    .fetch();

    return fatura;
  }
  async faturasPagas ({ request, response, view }) {
    const fatura = await Fatura.query()
    //.where('user_id', auth.user.email)
    .with('user')
    .with('servico')
    .with('pagamento')
    .where('status', 2)
    .where('mes_referencia', 10)
    .where('ano_referencia', 2020)
    .orderBy('id', 'desc')
    .fetch();

    return fatura;
  }
}

module.exports = UtilFaturaController
