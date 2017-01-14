const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const controllers = require('./controllers');
const authenticate = require('./authenticate');

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/device/:deviceId', authenticate.deviceControl, controllers.device.get);

app.post('/device/:deviceId', authenticate.deviceControl, controllers.device.set);

const options = {
    key: fs.readFileSync('../keys/server.key'),
    cert: fs.readFileSync('../keys/server.crt')
};

function start() {
    const port = process.env.PORT || 3000;
    https.createServer(options, app).listen(port, () => {
        console.log(`Zephyrus listening on port ${port}`);
    });
}

module.exports = {
    start: start
};
