'use strict'


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');
// const Helpers = use('Helpers');
// const { format } = use('date-fns');
// const Drive = use('Drive')

/**
 * Resourceful controller for interacting with perfils
 */
class PerfilController {

  async index ({ request, response, view, auth }) {
    const user = await User.find(auth.user.id)
    // const roles = await user.getRoles()
    return user;
  }

  async store ({ request, response }) {
    const data = request.only([
      'name', 'email', 'password'
    ]);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    return response.status(201).json(user); // retorna 201 de algo criado
  }

  async show ({ params, request, response, auth }) {
    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()
    if(roles[0] === "admin"){
      const user = await User.find(params.id)
      return await user;

    }else if(roles[0] === "empresa"){
      const user = await User.find(auth.user.id)
      return await user;

    }else if(roles[0] === "usuario"){
      const user = await User.find(auth.user.id)
      return await user;

    }
  }

  async update ({ params, request, response, auth}) {
    const user = await User.find(auth.user.id);

    let data = request.only([
      'name', 'email', 'password', 'cpf_cnpj', 'cep', 'pais', 'estado', 'cidade',
      'rua', 'numero', 'bairro', 'telefone', 'celular_whatsapp'
    ]);

    console.log("Editando perfil", data)

    if(data.password){
      //com senha
      console.log('aqui1')
      user.merge({
        name: data.name,
        email: data.email,
        password: data.password,
        cpf_cnpj: data.cpf_cnpj,
        cep: data.cep,
        pais: data.pais,
        estado: data.estado,
        cidade: data.cidade,
        rua: data.rua,
        numero: data.numero,
        bairro: data.bairro,
        telefone: data.telefone,
        celular_whatsapp: data.celular_whatsapp,
      })

    }else{
      //Sem senha
      console.log('aqui2 a')
      user.merge({
        name: data.name,
        email: data.email,
        cpf_cnpj: data.cpf_cnpj,
        cep: data.cep,
        pais: data.pais,
        estado: data.estado,
        cidade: data.cidade,
        rua: data.rua,
        numero: data.numero,
        bairro: data.bairro,
        telefone: data.telefone,
        celular_whatsapp: data.celular_whatsapp,
      })
    }

    await user.save();

    return user;

  }

  async destroy ({ params, request, response, auth }) {
    const user = await User.findByOrFail('id', params.id);
    const userId = user.id;
    const userIdAuth = auth.user.id
    if(userId === userIdAuth){
      user.delete()
    }else{
      return "Registro nao pertence ao usuário"
    }
  }
}

module.exports = PerfilController
