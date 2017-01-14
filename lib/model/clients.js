const Datastore = require('nedb')
const clientsdb = new Datastore({ filename: './db/clients.db', autoload: true });

module.exports = {
    findOne: clientsdb.findOne,
    insert: clientsdb.insert
};