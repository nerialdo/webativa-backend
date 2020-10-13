'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const Servico = use('App/Models/Servico');
const User = use('App/Models/User');

class ServicoController {

  async index ({ request, response, auth }) {
    const servico = await Servico.query()
    .with('user')
    .with('categoria')
    .where('user_id', auth.user.id,)
    .orderBy('id', 'desc')
    .fetch();

    return servico;
  }

  async store ({ request, response, auth }) {
    const data = request.only([
      'categoria_id', 'nome', 'recorrencia', 'valor'
    ]);
    var valor = data['valor']
    var valorPreparado = valor.replace(",", ".");

    const servico = await Servico.create({
      user_id: auth.user.id,
      categoria_id: data['categoria_id'],
      nome: data['nome'],
      recorrencia: data['recorrencia'],
      valor: parseFloat(valorPreparado),
    });

    return response.status(201).json(servico); // retorna 201 de algo criado
  }

  async show ({ params, request, response, auth }) {
    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()
    if(roles[0] === "admin"){

    } else if(roles[0] === 'empresa'){

      const produto = await Servico.query()
      .with('user')
      .with('categoria')
      .where('id', params.id)
      .where('user_id', auth.user.id)
      .fetch()

      return produto;

    }else if(roles[0] === "usuario"){

      const servico = await Servico.query()
      .with('user')
      .with('categoria')
      .where('id', params.id)
      .fetch()

      return servico;
    }
  }

  async update ({ params, request, response, auth }) {
    const data = request.only([
      'categoria_id', 'nome', 'recorrencia', 'valor', 'status'
    ]);
    var valor = data['valor']
    var valorPreparado = valor.replace(",", ".");

    const servico = await Servico.findByOrFail('id', params.id);
    const userId = servico.user_id;
    const userIdAuth = auth.user.id
    if(userId === userIdAuth){
      servico.merge({
        categoria_id: data['categoria_id'],
        nome: data['nome'],
        recorrencia: data['recorrencia'],
        valor: parseFloat(valorPreparado),
        status: data['status'],
      });
      await servico.save();
      return servico;
    }
    return "Sem permissão"
  }

  async destroy ({ params, request, response, auth }) {
    const servico = await Servico.findByOrFail('id', params.id);
    const userId = servico.user_id;
    const userIdAuth = auth.user.id
    if(userId === userIdAuth){
      servico.delete()
    }else{
      return "Registro nao pertence ao usuário"
    }
  }
}

module.exports = ServicoController
