const Event = use('Event');
const User = use('App/Models/User');
const Cliente = use('App/Models/User');
const ServicoCliente = use('App/Models/ServicoCliente');
const Fatura = use('App/Models/Fatura');
const PagamentoPix = use('App/Models/PagamentoPix');
const Email = use('App/Models/Email');
const Asaas = use('App/Models/Asaas/Asaas');
const {format, subDays, addDays, differenceInCalendarMonths, isAfter, parseISO} = use('date-fns')
var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const client = require('twilio')();
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const view = use('View');

const Env = use('Env')
const SANDBOX_ASAAS = Env.get('SANDBOX_ASAAS')
const ACCESS_TOKEN_ASAAS_SANDBOX = Env.get('ACCESS_TOKEN_ASAAS_SANDBOX')
const ACCESS_TOKEN_ASAAS_PRODUCION = Env.get('ACCESS_TOKEN_ASAAS_PRODUCION');

Event.on('new::faturasProximoAvencer', async (dias) => {
  // busca fatura que estão proxímos para vencer
  const dataAtual = format(new Date(), "yyyy-MM-dd")
  var resultSub = format(addDays(new Date(dataAtual), parseInt(dias)), "yyyy-MM-dd")
  // console.log("Data faturasProximoAvencer", resultSub, parseInt(dias))
  const fatura = await Fatura.query()
    .with('user')
    .with('servico')
    .where('vencimento', '=', resultSub)
    .where('status', '!=', 0) //fatura com status 1= pendente, 2: paga, 0= cancelada
    .fetch();

  const jsonFaturas = fatura.toJSON()
  for (let f = 0; f < jsonFaturas.length; f++) {
    const element = jsonFaturas[f];
    console.log("Data jsonServicoCliente", element)
    if(element.user.celular_whatsapp){
      // enviarWhatsApp('9887757873', element.user.name)
    }
    if(element.user.email){
      enviarEmail(element.user)
    }
  }
  
  async function enviarWhatsApp(numero, nome){
    try {
      client.messages.create({
        from: 'whatsapp:+14155238886',
        body: `Olá ${nome} 😃, sua fatura está vencendo em ${dias} dia${dias === '1' ? '' : 's'}, acesse seu painel de cliente para visualizar sua fatura. https://conta.webativa.com.br/`,
        to: `whatsapp:+55${numero}`
      }).then(message => console.log("Menagem enviada", message.sid))
    } catch (error) {
      console.log("error twilio", error)
    }
  }

  async function enviarEmail(json){
    console.log("Json faturasProximoAvencer", json)
    const conteudo = `Fique de olho na sua fatura. Passando apenas para lembrar que sua fatura está vencendo em ${dias} dia(s).`;
    const msg = {
      to: json.email, // Change to your recipient
      from: 'contato@webativa.com.br', // Change to your verified sender
      subject: `Sua fatura está vencendo em ${dias} dia${dias === '1' ? '' : 's'}`,
      // text: view.render('emails.fatura-criada', { id: '1' }),
      html: view.render('emails.fatura-vencendo', {
        nome: json.name,
        // dominio: json[0].dominio,
        conteudo
      }),
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
        salvarEmail()
        async function salvarEmail(){
          salvarEmail()
          async function salvarEmail(){
            try {
              await Email.create({
                user_id: json.id,
                to: json.email,
                from: 'contato@webativa.com.br',
                subject: `Sua fatura está vencendo em ${dias} dia${dias === '1' ? '' : 's'}`,
                conteudo: conteudo,
                status: 'Não Lido'
              });
            } catch (error) {
              console.log('Error salvar email faturasProximoAvencer', error)
            }
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })

  }
});

Event.on('new::gerarFaturasMesesAtras', async () => {
  console.log("Gerando gerarFaturasMesesAtras")
  // //mês atual
  // const mesAtual = format(new Date(), "MM")
  //buscar o dia atual
  const dataAtual = format(new Date(), "yyyy-MM-dd")
  //subtrai 10 dias da data atual
  var resultSub = format(subDays(new Date(dataAtual), 10), "yyyy-MM-dd")
  // console.log("dataAtual, ", dataAtual)
  // console.log("resultSub, ", resultSub)
  // console.log("mesAtual, ", mesAtual)
  // busca todos os serviços que estão com data data_proximo_pagamento menor ou igual a data atual
  const servicoCliente = await ServicoCliente.query()
    .with('user')
    .with('servico')
    .where('recorrencia', 'Mensal')
    .where('data_proximo_pagamento', '<=', dataAtual) //a data do proximo pagamento precisa ser menor ou igual a data atual
    .where('status', 1)
    .orderBy('id', 'desc')
    .fetch();

  // transforma em json
  const jsonServicoCliente = servicoCliente.toJSON()
  // console.log("jsonServicoCliente ", jsonServicoCliente.length, dataAtual)
  // console.log("jsonServicoClienteLength", jsonServicoCliente.length)
  //corre todos os serviços do resultado acima
  for (let s = 0; s < jsonServicoCliente.length; s++) {
    const elementServico = jsonServicoCliente[s];
    // console.log("elementServico ", elementServico)
    if(elementServico.user.celular_whatsapp){
      // enviarWhatsApp('9887757873', elementServico.user.name)
    }
    
    // const mesRef = format(new Date(elementServico.data_proximo_pagamento), "MM")
    // const anoRef = format(new Date(elementServico.data_proximo_pagamento), "yyyy")
    // console.log("elementServico", elementServico)

    var diasT = 0
    // for para cada mês de atraso
    var qtoMes = differenceInCalendarMonths(new Date(), elementServico.data_proximo_pagamento)
    console.log("qtoMes ", qtoMes)
    // const itens = [array com elementos]
    for (let m = 0; m < qtoMes; m++) {
      var resDias = diasT += 30;
      const dataProxPagParsedDate = addDays(elementServico.data_proximo_pagamento, resDias);
      // console.log("dataProxPagParsedDate ", elementServico.dominio, dataProxPagParsedDate)
      const newMesRef = format(new Date(dataProxPagParsedDate), "MM")
      const newAnoRef = format(new Date(dataProxPagParsedDate), "yyyy")
      // console.log(">>>>>>", newMesRef, newAnoRef)

      const mesAnoRef = {
        'newMesRef': newMesRef,
        'newAnoRef': newAnoRef,
        'dataProxPagParsedDate': dataProxPagParsedDate
      }

      //Verifica se a fatura já está criada
      const fatura = await Fatura.query()
        .where('user_id', elementServico.user_id)
        .where('servico_id', elementServico.servico_id)
        .where('mes_referencia', newMesRef)
        .where('ano_referencia', newAnoRef)
        .where('servico_cliente_id', elementServico.id)
        .where('status', '!=', 0) //fatura com status 1= pendente, 2: paga, 0= cancelada
        .fetch();

      const jsonFaturas = fatura.toJSON()
      console.log('jsonFaturas, ', jsonFaturas.length)
      if(jsonFaturas.length === 0){
        await verificarClienteCadastradoAsaas1(elementServico, mesAnoRef)
      }else{
        console.log("Cliente já possui fatura gerada")
      }
    }

    // verifica no asaas se o cliente já está cadastrado
    async function verificarClienteCadastradoAsaas1(dados, mesAnoRef){
      // console.log('verificarClienteCadastradoAsaas', dados)
      let dataVencimento = format(addDays(new Date(), 5), 'dd/MM/yyyy')
      var data = {
        'name': dados.user.name,
        'email': dados.user.email,
        'phone': dados.user.telefone,
        'mobilePhone': dados.user.celular_whatsapp,
        'address': dados.user.rua,
        'addressNumber': dados.user.numero,
        'complement': '',
        'province': dados.user.bairro,
        'postalCode': dados.user.cep,
        'cpfCnpj': dados.user.cpf_cnpj,
        'personType': 'FISICA',
        'city': dados.user.cidade,
        'state': dados.user.estado,
        'country': dados.user.pais,
        'observations': '',
        'value': dados.valor,
        'description': dados.servico.nome,
        'externalReference': dados.id,
        "primeiroPagamento": dataVencimento
      }
      let access_token = ""
      console.log("Consultando cliente asaas")
      access_token = SANDBOX_ASAAS === 'true' ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
      var retorno = await Asaas.consultarCliente(access_token, data);
      // console.log("Consultando cliente asaas retorno", retorno)
      if(retorno.totalCount === 0){
        // se o cliente não estived cadastrado, se cadastra um novo
        console.log('Criando um novo cliente')
        await cadastrarClienteAsaas1(data, dados, mesAnoRef)
      }else{
        // se o cliente já estive cadastrado, apanenas cria a fatura
        console.log('Cliente já está cadastrado')
        var data2 = {
          "id": retorno.data[0].id, // identeificação do cliente asaas
          "billingType": 'BOLETO',
          // "value" :{
          //   'elementServico': dados.value
          // } ,
          // "description": dados.description,
          "externalReference": dados.id, // id do serviço
          "primeiroPagamento": dataVencimento,
          // "dominio": ''
        }
        await criarCobrancasAsaas1(data2, dados, mesAnoRef)
      }
    }

    //cadastra novo cliente no asaas
    async function cadastrarClienteAsaas1(data, elementServico, mesAnoRef){
      let dataVencimento = format(addDays(new Date(), 5), 'dd/MM/yyyy')
      let access_token = ""
      access_token = SANDBOX_ASAAS === 'true' ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
      var retorno = await Asaas.cadastrarCliente(access_token, data);
      // console.log('Criando um novo cliente asaas retorno', retorno, data, elementServico, mesAnoRef)
      var data2 = {
        "id": retorno.id, // identeificação do cliente asaas
        "billingType": 'BOLETO',
        // "value" :{
        //   'elementServico': dados.value
        // } ,
        // "description": dados.description,
        "externalReference": elementServico.id, // id do serviço
        "primeiroPagamento": dataVencimento,
        // "dominio": ''
      }
      if(retorno){
        criarCobrancasAsaas1(data2, elementServico, mesAnoRef)
      }
    }

    //criar cobrança asaas
    async function criarCobrancasAsaas1(data, elementServico, mesAnoRef){
      // console.log("events criarCobrancasAsaas ", data, elementServico, mesAnoRef)
      let access_token = ""
      access_token = SANDBOX_ASAAS === 'true' ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
      var retorno = await Asaas.criarCobranca(access_token, data, elementServico);
      console.log('Criando cobrança asaas retorno', retorno)
      if(retorno){
        salavarCobranca1(retorno, elementServico, mesAnoRef)
      }
    }

    // salva cobrança no banco de dados
    async function salavarCobranca1(retorno, elementServico, mesAno){
      // console.log('elementServico salavarCobranca',retorno, elementServico)
      const linkFatura = retorno.bankSlipUrl;
      const linkFaturaAux = retorno.invoiceUrl
      const fatura = await Fatura.create({
        user_id: elementServico.user_id, // id do cliente
        servico_id: elementServico.servico_id,
        servico_cliente_id: elementServico.id,
        id_integracao: retorno.id,
        mes_referencia: mesAno.newMesRef,
        ano_referencia: mesAno.newAnoRef,
        vencimento: retorno.dueDate,
        link_fartura: linkFatura,
        link_fartura_aux: linkFaturaAux,
        valor: elementServico.valor,
        status: elementServico.status,
      });

      if(elementServico.user.celular_whatsapp){
          // enviarWhatsApp1('9887757873', element.user.name, element.mes_referencia)
      }
      if(fatura){
        await enviarEmail1(elementServico, linkFatura, linkFaturaAux)
      }
    }


    async function enviarEmail1(json){
      console.log("Json email", json, json.user.email)
      const conteudo = `Você possui faturas vencidas na WebAtiva, entre no seu painel de cliente e regularize sua situação`;
      const msg = {
        to: json.user.email, // Change to your recipient
        from: 'contato@webativa.com.br', // Change to your verified sender
        subject: 'Você possui faturas vencidas.',
        // text: view.render('emails.fatura-criada', { id: '1' }),
        html: view.render('emails.fatura-vencidas', {
          nome: json.user.name,
          // dominio: json[0].dominio,
          conteudo
        }),
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
          salvarEmail()
          async function salvarEmail(){
            salvarEmail()
            async function salvarEmail(){
              try {
                await Email.create({
                  user_id: json.user.id,
                  to: json.user.email,
                  from: 'contato@webativa.com.br',
                  subject: 'Você possui faturas vencidas.',
                  conteudo: conteudo,
                  status: 'Não Lido'
                });
              } catch (error) {
                console.log('Error salvar email gerarFaturasMesesAtras', error)
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error envio de email gerarFaturasMesesAtras", error, error.response.body)
        })

    }

    async function enviarWhatsApp1(numero, nome){
      try {
        client.messages.create({
          from: 'whatsapp:+14155238886',
          body: `Olá ${nome} Você possui faturas vencidas na WebAtiva 😱, entre no seu painel de cliente e regularize sua situação. Evite que seu serviço seja suspenso. https://conta.webativa.com.br/`,
          to: `whatsapp:+55${numero}`
        }).then(message => console.log("Menagem enviada", message.sid))
      } catch (error) {
        console.log("error twilio", error)
      }
    }
  }

});

Event.on('new::gerarFaturas', async () => {
  ///buscar o dia atual
  const dataAtual = format(new Date(), "yyyy-MM-dd HH:mm:ss")
  // console.log("dataAtual gerarFaturas", dataAtual)
  ///subtrai qto do dia atual
  var resultoAddDiasUm = format(new Date(dataAtual), "yyyy-MM-dd")
  var resultoAddDiasDois = format(addDays(new Date(dataAtual), 10), "yyyy-MM-dd")
  console.log("resultoAddDiasUm ", resultoAddDiasUm)
  console.log("resultoAddDiasDois ", resultoAddDiasDois)
  // busca todos os serviços que estão com data menor ou igual a data com a subtração de dias
  const servicoCliente = await ServicoCliente.query()
    .with('user')
    .with('servico')
    // .with('fatura')
    .whereBetween('data_proximo_pagamento',[resultoAddDiasUm,resultoAddDiasDois])
    // .where('data_proximo_pagamento', '<=', dataAtual) //a data do proximo pagamento precisa ser menor ou igual a data extraido os 15 dias
    .where('status', 1)
    .orderBy('id', 'desc')
    .fetch();

  /// transforma em json
  const jsonServicoCliente = servicoCliente.toJSON()

  console.log("jsonServicoCliente", jsonServicoCliente.length)

  for (let s = 0; s < jsonServicoCliente.length; s++) {
    const elementServico = jsonServicoCliente[s];
    ///percorre cada serviço
      const dataProxPagParsedDate = addDays(elementServico.data_proximo_pagamento, 0);
      // console.log('dataProxPagParsedDate', dataProxPagParsedDate)
      const newMesRef = format(new Date(elementServico.data_proximo_pagamento), "MM")
      const newAnoRef = format(new Date(elementServico.data_proximo_pagamento), "yyyy")

      const mesAnoRef = {
        'newMesRef': newMesRef,
        'newAnoRef': newAnoRef,
        'dataProxPagParsedDate': dataProxPagParsedDate
      }
      // console.log('newMesRef', newMesRef)
      // console.log('newAnoRef', newAnoRef)

      /// faz uma nova consulta para vê se a fatura já está criada
      const fatura = await Fatura.query()
      .with('user')
      .where('user_id', elementServico.user_id)
      .where('servico_id', elementServico.servico_id)
      .where('mes_referencia', newMesRef)
      .where('ano_referencia', newAnoRef)
      .where('servico_cliente_id', elementServico.id)
      .where('status', '!=', 0) //fatura com status 1= pendente, 2: paga, 0= cancelada
      .fetch();

      const jsonFaturas = fatura.toJSON()
      // console.log("jsonServicoCliente gerarFaturas", jsonFaturas, jsonFaturas.length)
      /// se a quantidade de fatura for 0 (ZERO) se cadastra
      if(jsonFaturas.length === 0){
        console.log('Gerando fatura')
        verificarClienteCadastradoAsaas(elementServico, mesAnoRef)
      }
  }
  // verifica no asaas se o cliente já está cadastrado
  async function verificarClienteCadastradoAsaas(dados, mesAnoRef){
    let dataVencimento = format(addDays(new Date(dados.data_proximo_pagamento), 5), 'dd/MM/yyyy')
    // console.log('verificarClienteCadastradoAsaas', dados, dataVencimento)
    var data = {
      'name': dados.user.name,
      'email': dados.user.email,
      'phone': dados.user.telefone,
      'mobilePhone': dados.user.celular_whatsapp,
      'address': dados.user.rua,
      'addressNumber': dados.user.numero,
      'complement': '',
      'province': dados.user.bairro,
      'postalCode': dados.user.cep,
      'cpfCnpj': dados.user.cpf_cnpj,
      'personType': 'FISICA',
      'city': dados.user.cidade,
      'state': dados.user.estado,
      'country': dados.user.pais,
      'observations': '',
      'value': dados.valor,
      'description': dados.servico.nome,
      'externalReference': dados.id,
    }
    let access_token = ""
    access_token = SANDBOX_ASAAS === 'true' ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
    var retorno = await Asaas.consultarCliente(access_token, data);
    if(retorno.totalCount === 0){
      // se o cliente não estived cadastrado, se cadastra um novo
      console.log('Criando um novo cliente')
      await cadastrarClienteAsaas(data, dados, mesAnoRef, dataVencimento)
    }else{
      // se o cliente já estive cadastrado, apanenas cria a fatura
      console.log('Cliente já está cadastrado', retorno.data[0])
      var data2 = {
        "id": retorno.data[0].id, // identeificação do cliente asaas
        "billingType": 'BOLETO',
        // "value" :{
        //   'elementServico': dados.value
        // } ,
        // "description": dados.description,
        "externalReference": dados.id, // id do serviço
        "primeiroPagamento": dataVencimento,
        // "dominio": ''
      }
      await criarCobrancasAsaas(data2, dados, mesAnoRef)
    }
  }

  //cadastra novo cliente no asaas
  async function cadastrarClienteAsaas(data, elementServico, mesAnoRef, dataVencimento){
    // let access_token = ""
    // access_token = SANDBOX_ASAAS === 'true' ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
    // var retorno = await Asaas.cadastrarCliente(access_token, data);
    // console.log('Criando um novo cliente asaas retorno', retorno)
    // criarCobrancasAsaas(retorno, elementServico, mesAnoRef)

    let access_token = ""
    access_token = SANDBOX_ASAAS === 'true' ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
    var retorno = await Asaas.cadastrarCliente(access_token, data);
    // console.log('Criando um novo cliente asaas retorno', retorno, data, elementServico, mesAnoRef)
    var data2 = {
      "id": retorno.id, // identeificação do cliente asaas
      "billingType": 'BOLETO',
      // "value" :{
      //   'elementServico': dados.value
      // } ,
      // "description": dados.description,
      "externalReference": elementServico.id, // id do serviço
      "primeiroPagamento": dataVencimento,
      // "dominio": ''
    }
    if(retorno){
      criarCobrancasAsaas(data2, elementServico, mesAnoRef)
    }
  }

  //criar cobrança asaas
  async function criarCobrancasAsaas(data, elementServico, mesAnoRef){
    let access_token = ""
    access_token = SANDBOX_ASAAS === 'true' ? ACCESS_TOKEN_ASAAS_SANDBOX : ACCESS_TOKEN_ASAAS_PRODUCION
    var retorno = await Asaas.criarCobranca(access_token, data, elementServico);
    console.log('Criando cobrança asaas retorno', retorno)
    if(retorno){
      await salavarCobranca(retorno, elementServico, mesAnoRef)
    }
  }

  // salva cobrança no banco de dados
  async function salavarCobranca(retorno, elementServico, mesAno){
    console.log('elementServico ',retorno, elementServico)
    const linkFatura = retorno.bankSlipUrl;
    const linkFaturaAux = retorno.invoiceUrl
    const fatura = await Fatura.create({
      user_id: elementServico.user_id, // id do cliente
      servico_id: elementServico.servico_id,
      servico_cliente_id: elementServico.id,
      id_integracao: retorno.id,
      mes_referencia: mesAno.newMesRef,
      ano_referencia: mesAno.newAnoRef,
      vencimento: retorno.dueDate,
      link_fartura: linkFatura,
      link_fartura_aux: linkFaturaAux,
      valor: elementServico.valor,
      status: elementServico.status,
    });

    if(elementServico.user.celular_whatsapp){
      // await enviarWhatsApp('9887757873', element.user.name, element.mes_referencia)
    }
    await enviarEmail(elementServico, linkFatura, linkFaturaAux)
  }

  async function enviarEmail(json, linkFatura, linkFaturaAux){
    console.log("Json ", json)
    const conteudo = `Sua fatura já está disponível. Entre no seu painel de cliente para mais informações`
    const msg = {
      to: json.user.email, // Change to your recipient
      from: 'contato@webativa.com.br', // Change to your verified sender
      subject: 'Sua nova fatura já está disponível',
      // text: view.render('emails.fatura-criada', { id: '1' }),
      html: view.render('emails.fatura-criada', {
        nome: json.user.name,
        linkFatura,
        linkFaturaAux,
        conteudo
      }),
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
        salvarEmail()
        async function salvarEmail(){
          try {
            await Email.create({
              user_id: json.user.id,
              to: json.user.email,
              from: 'contato@webativa.com.br',
              subject: 'Sua nova fatura já está disponível',
              conteudo: conteudo,
              status: 'Não Lido'
            });
          } catch (error) {
            console.log('Error salvar email salavarCobranca', error)
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })

  }

  async function enviarWhatsApp(numero, nome, mesref){
    try {
      client.messages.create({
        from: 'whatsapp:+14155238886',
        body: `Olá ${nome}, sua fatura do mês ${mesref} foi criada 😜😜😜😜, entre no seu painel de cliente e tenha mais informações. https://conta.webativa.com.br/`,
        to: `whatsapp:+55${numero}`
      }).then(message => console.log("Menagem enviada", message.sid))
    } catch (error) {
      console.log("error twilio", error)
    }
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
      valor_liquido: data.pix[0].valor,
      metodo_pagamento: 'PIX GERENCIANET',
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
