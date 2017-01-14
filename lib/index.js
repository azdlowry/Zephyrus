const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('./user');
const salus = require('./salus');

const authenticate = passport.authenticate('basic', { session: false });

passport.use(new BasicStrategy(
  function(username, password, done) {
    users.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!users.validatePassword(user, password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/device/:deviceId', authenticate, (req, res) => {
    salus.login({
    email: process.argv[2],
    password: process.argv[3],
    devId: req.params.deviceId
  }, (session) => {
      salus.getCurrentValues(session, (body) => res.send(body));
  } );
});

app.post('/device/:deviceId', authenticate, (req, res) => {
    salus.login({
    email: process.argv[2],
    password: process.argv[3],
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
