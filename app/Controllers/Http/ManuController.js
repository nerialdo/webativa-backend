'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/**
 * Resourceful controller for interacting with manus
 */
const Usuario = use('App/Models/User');
const Menu = use('App/Models/Menu');

class ManuController {

  async index ({ request, response, auth }) {
    const usuario = await Usuario.find(auth.user.id)
    const roles = await usuario.getRoles()
    console.log("roles index usuario", roles, auth.user.id)

    const menu = await Menu.query()
      .where('nivel', roles[0])
      .orderBy('nome', 'asc')
      .fetch();

    return menu;

    // if(roles[0] === "admin"){

    // }else if(roles[0] === "empresa"){
    //     //
    // }else if(roles[0] === "usuario"){

    // }
  }


  async store ({ request, response }) {
  }


  async show ({ params, request, response, view }) {
  }


  async update ({ params, request, response }) {
  }


  async destroy ({ params, request, response }) {
  }
}

module.exports = ManuController
