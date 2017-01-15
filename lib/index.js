const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const passport = require('passport');
const controllers = require('./controllers');
const authenticate = require('./authenticate');
const expressWinston = require('express-winston');
const winston = require('winston');

const app = express();

expressWinston.requestWhitelist.push('body')
expressWinston.responseWhitelist.push('body')
app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ],
      meta: true,
      msg: "HTTP {{req.method}} {{req.url}}",
      expressFormat: true,
      colorStatus: true,
      ignoreRoute: (req, res) => false
    }));

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/device', authenticate.user, controllers.device.get);
app.get('/device/:deviceId', authenticate.user, controllers.device.getDevice);
app.put('/device/:deviceId', authenticate.user, controllers.device.set);

app.get('/client', authenticate.user, controllers.client.getClients);
app.post('/client', authenticate.user, controllers.client.createClient);

app.get('/oauth2/authorize', authenticate.user, controllers.oauth2.authorization);
app.post('/oauth2/authorize', authenticate.user, controllers.oauth2.decision);
app.post('/oauth2/token', authenticate.client, controllers.oauth2.token);

function start() {
    const port = process.env.PORT || 3000;
    http.createServer(app).listen(port, () => {
        console.log(`Zephyrus listening on port ${port}`);
    });
}

module.exports = {
    start: start
};
