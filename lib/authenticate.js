const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const users = require('./model/users');
const clients = require('./model/clients');
const token = require('./model/accessTokens');

passport.use(new BasicStrategy(
    function basicStrategyVerify(username, password, done) {
        users.findOne({ email: username }, function(err, user) {
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

passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    clients.findOne({ id: username }, function (err, client) {
      if (err) { return callback(err); }
      if (!client || client.secret !== password) { return callback(null, false); }
      return callback(null, client);
    });
  }
));

passport.use(new BearerStrategy(
  function(accessToken, callback) {
    tokens.findOne({value: accessToken }, function (err, token) {
      if (err) { return callback(err); }
      if (!token) { return callback(null, false); }

      User.findOne({ _id: token.userId }, function (err, user) {
        if (err) { return callback(err); }
        if (!user) { return callback(null, false); }

        callback(null, user, { scope: '*' });
      });
    });
  }
));

module.exports = {
    client: passport.authenticate('client-basic', { session: false }),
    user: passport.authenticate(['basic', 'bearer'], { session: false })
};
