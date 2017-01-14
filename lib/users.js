const Datastore = require('nedb')
const usersdb = new Datastore({ filename: './db/users.db', autoload: true });

function findOne(userspec, callback) {
    usersdb.findOne(userspec, callback);
}

function validatePassword(user, password) {
    return password === user.password;
}

function add() {
    usersdb.insert({
        email: process.argv[2],
        password: process.argv[3],
        devId: process.argv[4]
    });
}

//add();

module.exports = {
    findOne: findOne,
    validatePassword: validatePassword
};