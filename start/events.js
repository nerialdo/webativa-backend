const Event = use('Event');
const User = use('App/Models/User');
const Cliente = use('App/Models/User');
const ServicoCliente = use('App/Models/ServicoCliente');
const Fatura = use('App/Models/Fatura');
const {format, subDays, addDays} = use('date-fns')

Event.on('new::gerarFaturas', async () => {
  //mês atual
  const mesAtual = format(new Date(), "MM")
  //buscar o dia atual
  const dataAtual = format(new Date(), "yyyy-MM-dd HH:mm:ss")
  //subtrai qto do dia atual
  var resultSub = format(subDays(new Date(dataAtual), 15), "yyyy-MM-dd HH:mm:ss")
  console.log("dataAtual, ", dataAtual)
  console.log("resultSub, ", resultSub)
  console.log("mesAtual, ", mesAtual)
  // busca todos os serviços que estão com data menor ou igual a data com a subtração de dias
  const servicoCliente = await ServicoCliente.query()
    .with('servico')
    .where('data_proximo_pagamento', '>=', resultSub) //a data do proximo pagamento precisa ser menor ou igual a data extraido os 15 dias
    .where('status', 1)
    .orderBy('id', 'desc')
    .fetch();

  // transforma em json
  const jsonServicoCliente = servicoCliente.toJSON()


  //corre todos os serviços do resultado acima
  for (let s = 0; s < jsonServicoCliente.length; s++) {
    const elementServico = jsonServicoCliente[s];
    const mesRef = format(new Date(elementServico.data_proximo_pagamento), "MM")
    const anoRef = format(new Date(elementServico.data_proximo_pagamento), "yyyy")
    console.log("elementServico", elementServico)
    //buscar se a fatura já foi criada
    const fatura = await Fatura.query()
      .where('user_id', elementServico.user_id)
      .where('servico_id', elementServico.servico_id)
      .where('mes_referencia', mesAtual)
      .where('status', '!=', 0) //fatura com status 1= pendente, 2: paga, 0= cancelada
      .fetch();

      const jsonFaturas = fatura.toJSON()

      console.log('jsonFaturas, ', jsonFaturas, jsonFaturas.length)
      if(jsonFaturas.length === 0){
        // console.log("jsonFaturas zero", jsonFaturas)
        const fatura = await Fatura.create({
          user_id: elementServico.user_id, // id do cliente
          servico_id: elementServico.servico_id,
          servico_clientes_id: elementServico.id,
          mes_referencia: mesRef,
          ano_referencia: anoRef,
          vencimento: addDays(elementServico.data_proximo_pagamento, 5),
          valor: elementServico.valor,
          status: elementServico.status,
        });
      }
  }

    // return cliente;
});

// Event.on('new::pushProEmp', async () => {
//   console.log('Enviando push para empresa');
// });
