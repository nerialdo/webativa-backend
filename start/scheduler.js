const Scheduler = use('node-schedule');
const Event = use('Event');


//envia push para empresasa
/// as 10:30
Scheduler.scheduleJob('00 04 * * *', function() {
  console.log("Rodou o cron")
  // Event.fire('new::gerarFaturasMesesAtras');
  Event.fire('new::gerarFaturas');
  // Event.fire('new::faturasProximoAvencer', ('2'));
});
Scheduler.scheduleJob('00 07 * * *', function() {
  console.log("Rodou o cron das 07 h")
  Event.fire('new::gerarFaturasMesesAtras');

});
// Scheduler.scheduleJob('00 08 * * *', function() {
//   console.log("Rodou o cron das 08 h")
//   Event.fire('new::gerarFaturas');

// });
Scheduler.scheduleJob('00 09 * * *', function() {
  console.log("Rodou o cron das 09 h")
  Event.fire('new::faturasProximoAvencer', ('2'));
});
// /// as 18:00
// Scheduler.scheduleJob('00 18 * * *', function() {
//   Event.fire('new::pushProEmp');
// });

// //envia push para clientes
// /// as 11:00
// Scheduler.scheduleJob('00 11 * * *', function() {
//   Event.fire('new::pushProCli');
// });

// /// as 18:00
// Scheduler.scheduleJob('00 19 * * *', function() {
//   Event.fire('new::pushProCli');
// });
