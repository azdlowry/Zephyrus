const oauth2orize = require('oauth2orize')
const users = require('../model/users');
const clients = require('../model/clients');
const tokens = require('../model/accessTokens');
const codes = require('../model/authCodes');

const server = oauth2orize.createServer();

server.serializeClient(function(client, callback) {
  return callback(null, client._id);
});

server.deserializeClient(function(id, callback) {
  clients.findOne({ _id: id }, function (err, client) {
    if (err) return callback(err);
    return callback(null, client);
  });
});

server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
  var code = {
    value: uid(16),
    clientId: client._id,
    redirectUri: redirectUri,
    userId: user._id
  };

  codes.insert(code, function(err) {
    if (err) return callback(err);

    callback(null, code.value);
  });
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
  codes.findOne({ value: code }, function (err, authCode) {
    if (err) return callback(err);
    if (authCode === undefined) { return callback(null, false); }
    if (client._id.toString() !== authCode.clientId) { return callback(null, false); }
    if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

    codes.remove(authCode, function (err) {
      if(err) return callback(err);

      var token = {
        value: uid(256),
        clientId: authCode.clientId,
        userId: authCode.userId
      };

      tokens.insert(token, function (err) {
        if (err) return callback(err);

        callback(null, token.value);
      });
    });
  });
}));

exports.authorization = [
    server.authorization(function(clientId, redirectUri, callback) {
        clients.findOne({ id: clientId }, function (err, client) {
            if (err) { return callback(err); }
            return callback(null, client, redirectUri);
        });
    }),
    function(req, res){
        res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
    }
]

exports.decision = [
    server.decision()
]

exports.token = [
    server.token(),
    server.errorHandler()
]

function uid (len) {
    var buf = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

