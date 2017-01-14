const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const salus = require('./salus');

const authenticate = require('./authenticate');

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/device/:deviceId', authenticate.deviceControl, (req, res) => {
    salus.login({
    email: req.user.email,
    password: req.user.password,
    devId: req.params.deviceId
  }, (session) => {
      salus.getCurrentValues(session, (body) => res.send(body));
  } );
});

app.post('/device/:deviceId', authenticate.deviceControl, (req, res) => {
    salus.login({
    email: req.user.email,
    password: req.user.password,
    devId: req.params.deviceId
  }, (session) => {
      salus.setTemp(session, req.query.setpoint);
      res.send(`Temp set to ${req.query.setpoint}`);
  } );
});

const options = {
    key: fs.readFileSync('../keys/server.key'),
    cert: fs.readFileSync('../keys/server.crt')
};

function start() { 
    https.createServer(options, app).listen(3000, () => {
        console.log('Zephyrus listening on port 3000');
    });
}

module.exports = {
    start: start
};
