'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const Categoria = use('App/Models/Categoria');

/**
 * Resourceful controller for interacting with categorias
 */
class CategoriaController {

  async index ({ request, response, auth}) {
    const categoria = await Categoria.query()
    .orderBy('id', 'desc')
    .fetch();
    console.log(categoria);
    return categoria;
  }


  async store ({ request, response }) {
    let data = request.only([
      'nome', 'status'
    ]);

    const categoria = await Categoria.create({
      nome: data.nome,
      status: data.status
    });

    return response.status(201).json(categoria); // retorna 201 de algo criado
  }


  async show ({ params, request, response, view }) {
  }


  async update ({ params, request, response }) {
  }


  async destroy ({ params, request, response }) {
  }
}

module.exports = CategoriaController
