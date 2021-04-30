'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Welcome' }
})

Route.post('/sessions', 'SessionController.store').validator('Session');
Route.post('/sessionscliente', 'SessionController.storeCliente').validator('Session');
Route.get('/perfil', 'PerfilController.index').middleware('auth');
Route.post('/perfil', 'PerfilController.store');
Route.post('/perfil/:id', 'PerfilController.update').middleware('auth');
Route.get('/tipoUsuario', 'UtilController.tipoUsuario').middleware('auth');
Route.get('/very-auth', 'UtilController.veryAuth').middleware('auth');

//categoria
Route.get('/categorias/', 'CategoriaController.index');
Route.get('/categoria/:id', 'CategoriaController.show').middleware('auth');
Route.post('/categoria', 'CategoriaController.store').middleware('auth');
Route.post('/categoria/:id', 'CategoriaController.update').middleware('auth');
Route.delete('/categoria/:id', 'CategoriaController.destroy').middleware('auth');

//serviços
Route.get('/servico/', 'ServicoController.index').middleware('auth');
Route.get('/servico/:id', 'ServicoController.show').middleware('auth');
Route.post('/servico', 'ServicoController.store').middleware('auth');
Route.post('/servico/:id', 'ServicoController.update').middleware('auth');
Route.delete('/servico/:id', 'ServicoController.destroy').middleware('auth');

//clientes
Route.get('/cliente-kinghost/', 'ClienteController.kinghost');
Route.get('/cliente/', 'ClienteController.index').middleware('auth');
Route.get('/cliente/:id', 'ClienteController.show').middleware('auth');
Route.post('/cliente', 'ClienteController.store').middleware('auth');
Route.post('/cliente/:id', 'ClienteController.update').middleware('auth');
Route.delete('/cliente/:id', 'ClienteController.destroy').middleware('auth');

//serviço cliente
Route.get('/servicos-cliente/', 'ServicoClienteController.index').middleware('auth');
Route.get('/servicos-cliente/:user', 'ServicoClienteController.index').middleware('auth');
Route.get('/servico-cliente/:id', 'ServicoClienteController.show').middleware('auth');
Route.post('/servico-cliente', 'ServicoClienteController.store').middleware('auth');
Route.post('/servico-cliente/:id', 'ServicoClienteController.update').middleware('auth');
Route.delete('/servico-cliente/:id', 'ServicoClienteController.destroy').middleware('auth');
Route.post('/mod-prox-pag-servico-cliente/', 'UtilServicoClienteController.modProxPag').middleware('auth');

//faturas
Route.get('/fatura', 'FaturaController.index').middleware('auth');
Route.get('/fatura/:id', 'FaturaController.show').middleware('auth');
Route.post('/fatura', 'FaturaController.store').middleware('auth');
Route.post('/fatura/:id', 'FaturaController.update').middleware('auth');
Route.delete('/fatura/:id', 'FaturaController.destroy').middleware('auth');

//útil faturas
Route.get('/util-faturas-vencidas', 'UtilFaturaController.faturasVencidas').middleware('auth');
Route.get('/util-faturas-pagas/:mes/:ano', 'UtilFaturaController.faturasPagas').middleware('auth');
Route.get('/faturas-cliente/:id', 'UtilFaturaController.faturasPorCliente').middleware('auth');

//pagamentos
Route.get('/pagamento', 'PagamentoController.index').middleware('auth');
Route.get('/pagamento/:id', 'PagamentoController.show').middleware('auth');
Route.post('/pagamento', 'PagamentoController.store').middleware('auth');
Route.post('/pagamento/:id', 'PagamentoController.update').middleware('auth');
Route.delete('/pagamento/:id', 'PagamentoController.destroy').middleware('auth');

//Metodos de pagamentos
Route.get('/metodo-pagamento', 'MetodosPagamentoController.index').middleware('auth');
Route.get('/metodo-pagamento/:id', 'MetodosPagamentoController.show').middleware('auth');
Route.post('/metodo-pagamento', 'MetodosPagamentoController.store').middleware('auth');
Route.post('/metodo-pagamento/:id', 'MetodosPagamentoController.update').middleware('auth');
Route.delete('/metodo-pagamento/:id', 'MetodosPagamentoController.destroy').middleware('auth');


Route.get('/enviar-sms/', 'UtilController.sms');

//menu
Route.get('/menu', 'ManuController.index').middleware('auth');

//Pesquisas
Route.get('/pesquisar-cliente/:termo', 'UtilPesquisaController.pesquisarClientes').middleware('auth');

//PagamentoPix
Route.get('/pagamento-pix', 'PagamentoPixController.index').middleware('auth');
Route.get('/pagamento-pix/:id', 'PagamentoPixController.show').middleware('auth');
Route.post('/pagamento-pix', 'PagamentoPixController.store').middleware('auth');
Route.post('/pagamento-pix/:id', 'PagamentoPixController.update').middleware('auth');
Route.delete('/pagamento-pix/:id', 'PagamentoPixController.destroy').middleware('auth');

//gerencianet
Route.get('/integra/', 'integracoes/GerencianetController.integra');
Route.post('/criar-cobranca-pix/', 'integracoes/GerencianetController.criarCobracaPix'); // precisa do :txid
Route.post('/criar-cobranca-imediata-pix/', 'integracoes/GerencianetController.criarCobracaImediataPix');
Route.get('/consultar-pix/:txid', 'integracoes/GerencianetController.consultarCobrancaPix');
Route.get('/gerar-qrcode-pix/:idlocation', 'integracoes/GerencianetController.gerarQRCodeCobrancaPix');
Route.get('/listar-chaves-pix/', 'integracoes/GerencianetController.listarChavesUsoPix');
Route.post('/criar-chaves-pix/', 'integracoes/GerencianetController.criarChaveUsoPix');
Route.put('/config-webhook-pix/', 'integracoes/GerencianetController.configurarWebhookUsoPix');
Route.get('/consultar-lista-webhook/', 'integracoes/GerencianetController.consultarListaWebhooksUsoPix');
Route.delete('/cencelar-webhook/', 'integracoes/GerencianetController.cancelarWebhookPixUsoPix');
Route.get('/listar-cobranca-pix/', 'integracoes/GerencianetController.listarCobrancasUsoPix');
Route.get('/listar-pix-recbidos/', 'integracoes/GerencianetController.consultarPixRecebidosUsoPix');
Route.get('/consultar-pix/', 'integracoes/GerencianetController.consultarPIXUsoPix');


Route.post('/webhook', 'integracoes/GerencianetController.retornoWebHook');
Route.post('/webhook/pix', 'integracoes/GerencianetController.retornoWebHookPix');

