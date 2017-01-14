const Datastore = require('nedb')
const clientsdb = new Datastore({ filename: './db/clients.db', autoload: true });

module.exports = {
    findOne: (query, callback) => clientsdb.findOne(query, callback),
    find: (query, callback) => clientsdb.find(query, callback),
    insert: (doc, callback) => clientsdb.insert(doc, callback)
};
