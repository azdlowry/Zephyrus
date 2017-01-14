const salus = require('../control/salus');

function get(req, res) {
    salus.login({
    email: req.user.email,
    password: req.user.password,
    devId: req.params.deviceId
  }, (session) => {
      salus.getCurrentValues(session, (body) => res.send(body));
  } );
}

function set(req, res) {
    salus.login({
    email: req.user.email,
    password: req.user.password,
    devId: req.params.deviceId
  }, (session) => {
      salus.setTemp(session, req.query.setpoint);
      res.send(`Temp set to ${req.query.setpoint}`);
  } );
}

module.exports = {
    get: get,
    set: set
};
