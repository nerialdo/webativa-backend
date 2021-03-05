const Scheduler = use('node-schedule');
const Event = use('Event');


//envia push para empresasa
/// as 10:30
Scheduler.scheduleJob('*/1 * * * *', function() {
  Event.fire('new::gerarFaturas');
  console.log("Rodou o cron")
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
