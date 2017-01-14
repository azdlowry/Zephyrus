const clients = require('../model/clients');

function createClient(req, res) {
    var client = {
        name: req.body.name,
        id: req.body.id,
        secret: req.body.secret,
        userId: req.user._id
    };

    clients.insert(client, (err) => {
        if (err) return res.send(err);

        res.json({ message: 'Client added', data: client });
    });
}

function getClients(req, res) {
  clients.find({ userId: req.user._id }, function(err, allClients) {
    if (err)
      return res.send(err);

    res.json(allClients);
  });
};

module.exports = {
    createClient: createClient,
    getClients: getClients
};
