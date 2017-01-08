var request = require('request');
var cheerio = require('cheerio');

function login(user, callback) {
  var jar = request.jar();
  request({
    method: 'POST',
    uri: 'https://salus-it500.com/public/login.php?lang=en',
    jar: jar,
    form: {
      IDemail: user.email,
      password: user.password,
      login: 'Login'
    }
  }, function(error, response, body) {
    if (!error && response.statusCode < 400) {
      console.log('Logged in session:', jar.getCookies('https://salus-it500.com/'));
      getToken(user, jar, callback);
    } else {
      console.log(error);
      console.log(response);
    }
  });
}

function getToken(user, jar, callback) {
  request({
    uri: 'https://salus-it500.com/public/control.php?devId=' + user.devId,
    jar: jar
  }, function(error, response, body) {
    if (!error && response.statusCode < 400) {
      //console.log('Got control response ' + response.statusCode);
      var $ = cheerio.load(body);
      var token = $('#token').val();
      console.log(token);
      callback({
        user: user,
        token: token,
        jar: jar
      });
    } else {
      console.log(error);
      console.log(response);
    }
  });
}

function setTemp(session, temp) {
  request({
    method: 'POST',
    uri: 'https://salus-it500.com/includes/set.php',
    jar: session.jar,
    form: {
      token: session.token,
      tempUnit: 0,
      devId: session.user.devId,
      current_tempZ1_set: 1,
      current_tempZ1: temp
      }
  });
}

function getCurrentValues(session, callback) {
  request({
    uri: 'https://salus-it500.com/public/ajax_device_values.php?devId=' + session.user.devId + '&token=' + session.token + '&_=' + new Date().getTime(),
    jar: session.jar,
    json: true
  }, function(error, response, body) {
    //console.dir(body);
    callback(body);
  });
}

module.exports = {
  login: login,
  setTemp: setTemp,
  getCurrentValues: getCurrentValues
};
