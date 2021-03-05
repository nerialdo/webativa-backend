'use strict'
const Cliente = use('App/Models/Cliente');
const User = use('App/Models/User');

class UtilPesquisaController {

  async pesquisarClientes ({ params, response, request, auth}) {

    console.log("data pesquisa", params.termo)

    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()

    if(roles[0] === "admin"){
      const user = await User.query()
        .where('email', 'like', params.termo + '%')
        .fetch();
      return await user;
    } else if(roles[0] === 'empresa'){
      // const user = await User.query()
      //   .where('email', 'like', params.termo + '%')
      //   .fetch();
      // return await user;
    }else if(roles[0] === "usuario"){

      return 'Sem permissão!';

    }

  }

}

module.exports = UtilPesquisaController
