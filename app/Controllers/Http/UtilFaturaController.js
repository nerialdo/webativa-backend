'use strict'
const Fatura = use('App/Models/Fatura');
const User = use('App/Models/User');
const {format, subDays} = use('date-fns')

class UtilFaturaController {
  async faturasVencidas ({ request, response, auth }) {
    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()
    console.log("Roles", roles)
    if(roles[0] === "admin"){
      const fatura = await Fatura.query()
      //.where('user_id', auth.user.email)
      .with('user')
      .with('servico')
      .with('pagamento')
      .where('status', 1)
      .orderBy('id', 'desc')
      .fetch();

      return fatura;

    }else if(roles[0] === "empresa"){

      const fatura = await Fatura.query()
      .where('user_id', auth.user.id)
      .with('user')
      .with('servico')
      .with('pagamento')
      .where('status', 1)
      .orderBy('id', 'desc')
      .fetch();

      return fatura;


    }else if(roles[0] === "usuario"){

      const fatura = await Fatura.query()
      .where('user_id', auth.user.id)
      .with('user')
      .with('servico')
      .with('pagamento')
      .where('status', 1)
      .orderBy('id', 'desc')
      .fetch();

      return fatura;

    }

  }
  async faturasPagas ({ request, response, auth }) {
    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()
    if(roles[0] === "admin"){

      const fatura = await Fatura.query()
      //.where('user_id', auth.user.email)
      .with('user')
      .with('servico')
      .with('pagamento')
      .where('status', 2)
      // .where('mes_referencia', 10)
      // .where('ano_referencia', 2020)
      .orderBy('id', 'desc')
      .fetch();

      return fatura;

    }else if(roles[0] === "empresa"){
      const fatura = await Fatura.query()
      //.where('user_id', auth.user.email)
      .with('user')
      .with('servico')
      .with('pagamento')
      .where('status', 2)
      // .where('mes_referencia', 10)
      // .where('ano_referencia', 2020)
      .orderBy('id', 'desc')
      .fetch();

      return fatura;
    }else if(roles[0] === "usuario"){
      const fatura = await Fatura.query()
      .where('user_id', auth.user.id)
      .with('user')
      .with('servico')
      .with('pagamento')
      .where('status', 2)
      // .where('mes_referencia', 10)
      // .where('ano_referencia', 2020)
      .orderBy('id', 'desc')
      .fetch();

      return fatura;
    }


  }

  async faturasPorCliente ({params, request, response }) {
    const fatura = await Fatura.query()
    .where('user_id', params.id)
    .with('user')
    .with('servico')
    .with('pagamento')
    .orderBy('id', 'desc')
    .fetch();

    return fatura;
  }
}

module.exports = UtilFaturaController
