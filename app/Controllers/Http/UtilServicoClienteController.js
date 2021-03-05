'use strict'
const ServicoCliente = use('App/Models/ServicoCliente');
const {addDays} = use('date-fns');

class UtilServicoClienteController {
  async modProxPag ({ params, request, response, auth }) {
    // const servicoCliente = await ServicoCliente.find(params.id);

    const data = request.only([
      'idServicoCliente'
    ]);

    const servicoCliente = await ServicoCliente.find(parseInt(data.idServicoCliente));
    var dadosServiCliente = servicoCliente.toJSON();
    var proximaData = addDays(dadosServiCliente.data_proximo_pagamento, 30)
    console.log("servicoCliente", dadosServiCliente);
    console.log("proximaData", proximaData);
    // console.log('editando...',data)
    servicoCliente.merge({
      data_proximo_pagamento: proximaData,
    })

    await servicoCliente.save();

    return servicoCliente;
  }
}

module.exports = UtilServicoClienteController
