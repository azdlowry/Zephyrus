
function findOne(userspec, callback) {
    if (userspec.username !== process.argv[2]) {
        callback(new Error('Unknown user'));
    }

    callback(undefined, userspec);
}

function validatePassword(user, password) {
    return password === process.argv[3];
}

module.exports = {
    findOne: findOne,
    validatePassword: validatePassword
};