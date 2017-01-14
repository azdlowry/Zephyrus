const Datastore = require('nedb')
const authCodesdb = new Datastore({ filename: './db/authCodes.db', autoload: true });

module.exports = {
    findOne: (query, callback) => authCodesdb.findOne(query, callback),
    find: (query, callback) => authCodesdb.find(query, callback),
    insert: (doc, callback) => authCodesdb.insert(doc, callback),
    remove: (doc, callback) => authCodesdb.remove(doc, callback)
};
