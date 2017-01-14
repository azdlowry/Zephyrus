const Datastore = require('nedb')
const accessTokensdb = new Datastore({ filename: './db/accessTokens.db', autoload: true });

module.exports = {
    findOne: (query, callback) => accessTokensdb.findOne(query, callback),
    find: (query, callback) => accessTokensdb.find(query, callback),
    insert: (doc, callback) => accessTokensdb.insert(doc, callback)
};
