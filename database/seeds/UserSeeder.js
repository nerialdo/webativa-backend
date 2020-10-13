'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class UserSeeder {
  async run () {
    const roleAdmin = await Factory.model('Adonis/Acl/Role').create({
      slug: 'admin',
      name: 'Admin',
      description: 'Rule para Administrador do sistema, controla as rotas de administração'
    })
    const admin = await Factory.model('App/Models/User').create({
      name: 'Nerialdo',
      email: 'nerialdosousa@hotmail.com',
      password: '123456',
      //password_confirmation: '123456',
      tipo_conta: 'admin',
      cpf_cnpj: '11111111111',
      cep: '65200-000',
      pais: 'Brasil',
      estado: 'MA',
      cidade: 'Pinheiro',
      rua: 'Nome da Rua',
      numero: '123',
      bairro: 'Centro',
      telefone: '99999999',
      celular_whatsapp: '99999999',
      avatar: '#',
    })
    await admin.roles().attach([roleAdmin.id])

    const roleEmpresa = await Factory.model('Adonis/Acl/Role').create({
      slug: 'empresa',
      name: 'empresa',
      description: 'Rule para empresas, controla as todas de acesso das empresas'
    })
    const empresa = await Factory.model('App/Models/User').create({
      name: 'Empresa01',
      email: 'empresa01@hotmail.com',
      password: '123456',
      //password_confirmation: '123456',
      tipo_conta: 'empresa',
      cpf_cnpj: '11111111111',
      cep: '65200-000',
      pais: 'Brasil',
      estado: 'MA',
      cidade: 'Pinheiro',
      rua: 'Nome da Rua',
      numero: '123',
      bairro: 'Centro',
      telefone: '99999999',
      celular_whatsapp: '99999999',
      avatar: '#',
    })
    await empresa.roles().attach([roleEmpresa.id])

    const empresao2 = await Factory.model('App/Models/User').create({
      name: 'Empresa02',
      email: 'empresa02@hotmail.com',
      password: '123456',
      //password_confirmation: '123456',
      tipo_conta: 'empresa',
      cpf_cnpj: '11111111111',
      cep: '65200-000',
      pais: 'Brasil',
      estado: 'MA',
      cidade: 'Pinheiro',
      rua: 'Nome da Rua',
      numero: '123',
      bairro: 'Centro',
      telefone: '99999999',
      celular_whatsapp: '99999999',
      avatar: '#',
    })
    await empresao2.roles().attach([roleEmpresa.id])

    const roleUsuario = await Factory.model('Adonis/Acl/Role').create({
      slug: 'usuario',
      name: 'Usuário',
      description: 'Rule para usuarios, controla as todas de acesso dos usuarios do sistema'
    })
    const usuario = await Factory.model('App/Models/User').create({
      name: 'Usuario01',
      email: 'usuario01@hotmail.com',
      password: '123456',
      //password_confirmation: '123456',
      tipo_conta: 'usuario',
      cpf_cnpj: '11111111111',
      cep: '65200-000',
      pais: 'Brasil',
      estado: 'MA',
      cidade: 'Pinheiro',
      rua: 'Nome da Rua',
      numero: '123',
      bairro: 'Centro',
      telefone: '99999999',
      celular_whatsapp: '99999999',
      avatar: '#',
    })
    await usuario.roles().attach([roleUsuario.id])

    const usuario01 = await Factory.model('App/Models/User').create({
      name: 'Usuario02',
      email: 'usuario02@hotmail.com',
      password: '123456',
      //password_confirmation: '123456',
      tipo_conta: 'usuario',
      cpf_cnpj: '11111111111',
      cep: '65200-000',
      pais: 'Brasil',
      estado: 'MA',
      cidade: 'Pinheiro',
      rua: 'Nome da Rua',
      numero: '123',
      bairro: 'Centro',
      telefone: '99999999',
      celular_whatsapp: '99999999',
      avatar: '#',
    })
    await usuario01.roles().attach([roleUsuario.id])

  }
}
module.exports = UserSeeder
