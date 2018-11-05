const rewards = require('../controllers/rewards.server.controller');
const jwt = require('jwt-simple');
const db = require('../../config/db');

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
    test.route('/projects/:id/rewards')
        .put(myMiddleware, rewards.update_reward)
        .get(rewards.view_reward);
};