'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const Cliente = use('App/Models/User');
// const Request = use('Adonis/Src/Request')
const axios = use('axios');
const http = use('http');
const https = use('https');
const btoa = use('btoa');
/**
 * Resourceful controller for interacting with clientes
 */
class ClienteController {

  async index ({ request, response, auth}) {
    console.log("AQUI CLEINTES")
    const cliente = await Cliente.find(auth.user.id)
    const roles = await cliente.getRoles()
    console.log("roles index cliente", roles, auth.user.id)
    if(roles[0] === "admin"){

      const cliente = await Cliente.query()
      .orderBy('id', 'desc')
      .fetch();

      return cliente;

    }else if(roles[0] === "empresa"){
      console.log("aquii")
      const cliente = await Cliente.query()
      .where('usuario_pai', auth.user.id)
      .orderBy('id', 'desc')
      .fetch();

      return cliente;
    }else if(roles[0] === "usuario"){

    }
  }

  async kinghost ({ request, response}) {
    let data = request.all()
    console.log('data ', data)
    // try {
    //   const res = await Request("https://api.uni5.net/cliente");
    //   return response.status(res.statusCode).send(res.body);
    // } catch (e) {
    //   console.log("error", e)
    //   return response.status(500).json({err: e });
    // }
    // var config = {
    //   // headers: {Authorization: 'digest -u' + 'nerialdosousa@hotmail.com:MCAR1814', 'Access-Control-Allow-Origin' : '*', },
    //   headers: {Authorization: 'Digest', username:'nerialdosousa@hotmail.com', password:'MCAR1814' },
    // };


    // var b64 = btoa('nerialdosousa@hotmail.com' + ":" + 'MCAR1814');
    // try {
    //   const res = await axios.get("https://api.uni5.net/cliente/", {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //         'Authorization': "Digest " + btoa('nerialdosousa@hotmail.com:MCAR1814')
    //     },
    // });
    // console.log("response.status(res.status).send(res.data)", res)
    //   return response.status(res.status).send(res.data);
    // } catch (e) {
    //   console.log("eee", e.response)
    //   return response.status(500).json({err: e });
    // }

  }

  async store ({ request, response, auth }) {
    let data = request.only([
      'name', 'email', 'password', 'tipo_conta', 'usuario_pai', 'cpf_cnpj', 'cep', 'pais', 'estado', 'cidade',
      'rua', 'numero', 'bairro', 'telefone', 'celular_whatsapp'
    ]);

    console.log("response", data)
    const user = await Cliente.findBy("email", data.email);
    if (user) {
      return response
        .status(404)
        .json({ message: "Este email já foi cadastrado." });
    }

    const cliente = await Cliente.create({
      name: data.name,
      email: data.email,
      password: data.password,
      tipo_conta: data.tipo_conta,
      usuario_pai: auth.user.id,
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
    });
    await cliente.roles().attach(3); // adiciona acl no usuario
    return response.status(201).json(cliente); // retorna 201 de algo criado
  }

  async show ({ params, request, response, auth }) {
    const cliente = await Cliente.find(auth.user.id)
    const roles = await cliente.getRoles()

    if(roles[0] === "admin"){
      const cliente = await Cliente.find(params.id)
      return await cliente;

    }else if(roles[0] === "empresa"){
      const cliente = await Cliente.query().where('usuario_pai', auth.user.id).where('id', params.id).first()
      return await cliente;

    }else if(roles[0] === "usuario"){
      const cliente = await Cliente.find(params.id)
      return await cliente;
    }
  }

  async update ({ params, request, response, auth }) {
    const cliente = await Cliente.find(params.id);


    let data = request.only([
      'name', 'email', 'password', 'usuario_pai', 'cpf_cnpj', 'cep', 'pais', 'estado', 'cidade',
      'rua', 'numero', 'bairro', 'telefone', 'celular_whatsapp'
    ]);

    console.log("data ==>, ", data)

    if(data.password){
      //com senha
      // console.log('aqui1')
      cliente.merge({
        name: data.name,
        email: data.email,
        password: data.password,
        usuario_pai: auth.user.id,
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
      // console.log('aqui2 a')
      cliente.merge({
        name: data.name,
        email: data.email,
        tipo_conta: data.tipo_conta,
        usuario_pai: auth.user.id,
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

    await cliente.save();
    await cliente.roles().attach(3); // adiciona acl no usuario
    return cliente;
  }

  async destroy ({ params, request, response, auth }) {
    console.log("Deletando ...", params.id)
    const cliente = await Cliente.findByOrFail('id', params.id);
    console.log("cliente", cliente)
    // const clienteId = cliente.id;
    // const clienteIdAuth = auth.cliente.id
    // if(clienteId === clienteIdAuth){
      cliente.delete()
    // }else{
    //   return "Registro nao pertence ao usuário"
    // }
  }
}

module.exports = ClienteController
