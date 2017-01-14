const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('./users');

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

module.exports = {
    deviceControl: passport.authenticate('basic', { session: false })
};
