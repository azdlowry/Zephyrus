const Datastore = require('nedb')
const usersdb = new Datastore({ filename: './db/users.db', autoload: true });

function findOne(userspec, callback) {
    usersdb.findOne(userspec, callback);
}

function validatePassword(user, password) {
    return password === user.password;
}

function add() {
    usersdb.remove({});
    usersdb.insert({
        email: process.env.SALUS_EMAIL,
        password: process.env.SALUS_PASSWORD,
        devId: process.env.SALUS_DEVID
    });
}

add();

module.exports = {
    findOne: findOne,
    validatePassword: validatePassword
};
