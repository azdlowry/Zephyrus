const express = require('express');
const app = express();
const salus = require('./salus');

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/device/:deviceId', (req, res) => {
    salus.login({
    email: process.argv[2],
    password: process.argv[3],
    devId: req.params.deviceId
  }, (session) => {
      salus.getCurrentValues(session, (body) => res.send(body));
  } );
});

function start() { 
    app.listen(3000, () => {
        console.log('Zephyrus listening on port 3000');
    });
}

module.exports = {
    start: start
};
