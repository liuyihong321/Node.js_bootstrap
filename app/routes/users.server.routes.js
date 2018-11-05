/**
 * Created by yli227 on 7/08/17.
 */
const jwt = require('jwt-simple');
const db = require('../../config/db');
const users = require('../controllers/user.server.controller');

const isValidToken = function (token, done) {

    if (token !== null){
        let decode = jwt.decode(token, '87654321');
        let login = decode.iss;
        db.get().query('SELECT token FROM Token WHERE user_id = ?', login, function (err, result) {
            if (err) return done(null, false);

            else if (result[0]['token'] === token){
                return done(null, true);
            }
            else {
                return done(null, false);
            }

        });
    }
    else {
        return done(null, false);
    }
};

const myMiddleware = (req, res, next) => {
    isValidToken(req.get('X-Authorization'), function (err, result) {
        if (result) {
            next();
        }
        else {
            res.status(401);
        }

    });
};

module.exports = function (test) {
    test.route('/users')
        .post(users.create);

    test.route('/users/:userId')
        .get(users.read)
        .put(myMiddleware, users.update);
        // .delete(users.delete);
    test.route('/users/login')
        .post(users.login);

    test.route('/users/logout')
        .post(myMiddleware, users.logout)
};

