const salus = require('../control/salus');

function getDevice(req, res) {
    salus.login({
    email: req.user.email,
    password: req.user.password,
    devId: req.params.deviceId
  }, (session) => {
      salus.getCurrentValues(session, (body) => res.send(body));
  } );
}

function get(req, res) {
    res.json([ { deviceId: req.user.devId }]);
}

function set(req, res) {
    salus.login({
    email: req.user.email,
    password: req.user.password,
    devId: req.params.deviceId
  }, (session) => {
      salus.setTemp(session, req.query.setpoint, () => res.json({ deviceId: req.params.deviceId, setPoint: req.query.setpoint }));
  } );
}

module.exports = {
    get: get,
    getDevice: getDevice,
    set: set
};
