const Event = use('Event');
const User = use('App/Models/User');
const Cliente = use('App/Models/User');
const ServicoCliente = use('App/Models/ServicoCliente');
const Fatura = use('App/Models/Fatura');
const PagamentoPix = use('App/Models/PagamentoPix');
const {format, subDays, addDays, differenceInCalendarMonths, isAfter, parseISO} = use('date-fns')

Event.on('new::gerarFaturasMesesAtras', async () => {
  //mês atual
  const mesAtual = format(new Date(), "MM")
  //buscar o dia atual
  const dataAtual = format(new Date(), "yyyy-MM-dd HH:mm:ss")

  //subtrai qto do dia atual
  var resultSub = format(subDays(new Date(dataAtual), 10), "yyyy-MM-dd HH:mm:ss")
  console.log("dataAtual, ", dataAtual)
  console.log("resultSub, ", resultSub)
  // console.log("mesAtual, ", mesAtual)
  // busca todos os serviços que estão com data menor ou igual a data com a subtração de dias
  const servicoCliente = await ServicoCliente.query()
    .with('servico')
    .where('data_proximo_pagamento', '<=', resultSub) //a data do proximo pagamento precisa ser menor ou igual a data extraido os 15 dias
    .where('status', 1)
    .orderBy('id', 'desc')
    .fetch();

  // transforma em json
  const jsonServicoCliente = servicoCliente.toJSON()

  //console.log("jsonServicoClienteLength", jsonServicoCliente.length)
  //console.log("jsonServicoCliente", jsonServicoCliente)
  //corre todos os serviços do resultado acima
  for (let s = 0; s < jsonServicoCliente.length; s++) {
    const elementServico = jsonServicoCliente[s];
    // const mesRef = format(new Date(elementServico.data_proximo_pagamento), "MM")
    // const anoRef = format(new Date(elementServico.data_proximo_pagamento), "yyyy")
    //console.log("elementServico", elementServico)

    var diasT = 0
    // for para cada mês de atraso
    var qtoMes = differenceInCalendarMonths(new Date(), elementServico.data_proximo_pagamento)
    console.log("qtoMes ", qtoMes)
    for (let m = 0; m < qtoMes; m++) {
      var resDias = diasT += 30;
      const dataProxPagParsedDate = addDays(elementServico.data_proximo_pagamento, resDias);
      const newMesRef = format(new Date(dataProxPagParsedDate), "MM")
      const newAnoRef = format(new Date(dataProxPagParsedDate), "yyyy")
      //console.log(">>>>>>", dataProxPagParsedDate, newMesRef)
      const fatura = await Fatura.query()
      .where('user_id', elementServico.user_id)
      .where('servico_id', elementServico.servico_id)
      .where('mes_referencia', newMesRef)
      .where('servico_clientes_id', elementServico.id)
      .where('status', '!=', 0) //fatura com status 1= pendente, 2: paga, 0= cancelada
      .fetch();

      const jsonFaturas = fatura.toJSON()

      //console.log('jsonFaturas, ', jsonFaturas, jsonFaturas.length)
      if(jsonFaturas.length === 0){
        //console.log("jsonFaturas zero", jsonFaturas)
        const fatura = await Fatura.create({
          user_id: elementServico.user_id, // id do cliente
          servico_id: elementServico.servico_id,
          servico_clientes_id: elementServico.id,
          mes_referencia: newMesRef,
          ano_referencia: newAnoRef,
          vencimento: addDays(dataProxPagParsedDate, 0),
          valor: elementServico.valor,
          status: elementServico.status,
        });
        console.log('retorno gerarFaturasMesesAtras', fatura)
      }
    }

    //buscar se a fatura já foi criada
    // const past = isAfter(dataProxPagParsedDate, new Date());
    // console.log("past _>", past)
    // if(!past){
    //   console.log("aqui passou", dataProxPagParsedDate)
    // }
    // const fatura = await Fatura.query()
    //   .where('user_id', elementServico.user_id)
    //   .where('servico_id', elementServico.servico_id)
    //   .where('mes_referencia', mesRef)
    //   .where('status', '!=', 0) //fatura com status 1= pendente, 2: paga, 0= cancelada
    //   .fetch();

    //   const jsonFaturas = fatura.toJSON()

    //   console.log('jsonFaturas, ', jsonFaturas, jsonFaturas.length)
    //   if(jsonFaturas.length === 0){
    //     console.log("jsonFaturas zero", jsonFaturas)
    //     const fatura = await Fatura.create({
    //       user_id: elementServico.user_id, // id do cliente
    //       servico_id: elementServico.servico_id,
    //       servico_clientes_id: elementServico.id,
    //       mes_referencia: mesRef,
    //       ano_referencia: anoRef,
    //       vencimento: addDays(elementServico.data_proximo_pagamento, 0),
    //       valor: elementServico.valor,
    //       status: elementServico.status,
    //     });
    //   }
  }

    // return cliente;
});

Event.on('new::gerarFaturas', async () => {
 //buscar o dia atual
  const dataAtual = format(new Date(), "yyyy-MM-dd HH:mm:ss")
  //subtrai qto do dia atual
  var resultoAddDiasUm = format(addDays(new Date(dataAtual), 10), "yyyy-MM-dd")
  var resultoAddDiasDois = format(addDays(new Date(dataAtual), 20), "yyyy-MM-dd")
  // console.log("dataAtual gerarFaturas, ", dataAtual)
  // console.log("resultoAddDiasUm gerarFaturas, ", resultoAddDiasUm)
  // console.log("resultoAddDiasDois gerarFaturas, ", resultoAddDiasDois)
  // busca todos os serviços que estão com data menor ou igual a data com a subtração de dias
  const servicoCliente = await ServicoCliente.query()
    .with('servico')
    .whereBetween('data_proximo_pagamento',[resultoAddDiasUm,resultoAddDiasDois])
    // .where('data_proximo_pagamento', '<=', dataAtual) //a data do proximo pagamento precisa ser menor ou igual a data extraido os 15 dias
    .where('status', 1)
    .orderBy('id', 'desc')
    .fetch();

  // transforma em json
  const jsonServicoCliente = servicoCliente.toJSON()
  for (let s = 0; s < jsonServicoCliente.length; s++) {
    const elementServico = jsonServicoCliente[s];
    // console.log("elementServico gerarFaturas", elementServico)
    //percorre cada serviço
    // for (let s = 0; s < elementServico.length; s++) {
      // const elementServico = jsonServicoCliente[s];
      // console.log("jsonServicoCliente gerarFaturas", elementServico)

      const dataProxPagParsedDate = addDays(elementServico.data_proximo_pagamento, 10);
      // console.log('dataProxPagParsedDate', dataProxPagParsedDate)
      const newMesRef = format(new Date(resultoAddDiasUm), "MM")
      const newAnoRef = format(new Date(resultoAddDiasUm), "yyyy")
      // console.log('newMesRef', newMesRef)

      // faz uma nova consulta para vê se a fatura já está criada
      const fatura = await Fatura.query()
      .where('user_id', elementServico.user_id)
      .where('servico_id', elementServico.servico_id)
      .where('mes_referencia', newMesRef)
      .where('servico_clientes_id', elementServico.id)
      .where('status', '!=', 0) //fatura com status 1= pendente, 2: paga, 0= cancelada
      .fetch();

      const jsonFaturas = fatura.toJSON()
      // console.log("jsonServicoCliente gerarFaturas", jsonFaturas.length)
      // se a quantidade de fatura for 0 (ZERO) se cadastra
      if(jsonFaturas.length === 0){
        const fatura = await Fatura.create({
          user_id: elementServico.user_id, // id do cliente
          servico_id: elementServico.servico_id,
          servico_clientes_id: elementServico.id,
          mes_referencia: newMesRef,
          ano_referencia: newAnoRef,
          vencimento: dataProxPagParsedDate,
          valor: elementServico.valor,
          status: elementServico.status,
        });
        // console.log('retorno gerarFaturas', fatura)
      }
    // }
  }
})

Event.on('new::pixRecebido', async (data) => {
  console.log("data evento pixRecebido", data)
  //buscamos o saque
  const pagamentoPix = await PagamentoPix.findBy("txid", data.pix[0].txid);
  pagamentoPix.merge({
    horario_transferencia: data.pix[0].horario,
    endToEndId: data.pix[0].endToEndId,
    txid: data.pix[0].txid,
    chave: data.pix[0].chave,
    // valor: data.pix[0].valor,
    infoPagador: data.pix[0].infoPagador,
    status: 'Pago',
  })
  await pagamentoPix.save();

  if(pagamentoPix){
    const fatura = await Fatura.find(pagamentoPix.fatura_id);
    const dataAtual = format(new Date(), "yyyy-MM-dd") //2021-03-30

    fatura.merge({
      data_pagamento: dataAtual,
      status: 2,
    })

    await fatura.save();

    return fatura;
  }

  return pagamentoPix;
})

// Event.on('new::pushProEmp', async () => {
//   console.log('Enviando push para empresa');
// });
