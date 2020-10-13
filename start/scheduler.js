const Scheduler = use('node-schedule');
const Event = use('Event');


//envia push para empresasa
/// as 10:30
Scheduler.scheduleJob('22 11 * * *', function() {
  Event.fire('new::gerarFaturas');
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
