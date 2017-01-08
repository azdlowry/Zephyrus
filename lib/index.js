var readline = require('readline');
var salus = require('./salus');

function setupController(session) {
  var rl = readline.createInterface(process.stdin, process.stdout);
  rl.prompt();
  rl.on('line', function(line) {
    salus.setTemp(session, parseFloat(line));
    rl.prompt();
  }).on('close', function() {
    process.exit(0);
  });
}

function start(user) {
  salus.login(user, function(session) {
    setupController(session);

    console.log('Time, Temp, Set Point, Heat on/off');
    setInterval(function() {
      salus.getCurrentValues(session, function(body) {
        console.log(new Date().toLocaleTimeString() +', ' + body.CH1currentRoomTemp + ', ' + body.CH1currentSetPoint + ', ' + body.CH1heatOnOffStatus);
      });
    }, 5000);
  });
}

module.exports = {
  start: start
}
