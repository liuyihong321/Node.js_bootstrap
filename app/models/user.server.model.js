/**
 * Created by yli227 on 7/08/17.
 */
const db = require('../../config/db');
const jwt = require('jwt-simple');

const async = require('async');

let error400 = new Error('400');
let error401 = new Error('401');
let error403 = new Error('403');
let error404 = new Error('404');


exports.getOne = function (user_id, done) {
    db.get().query('SELECT * FROM User WHERE user_id = ?', user_id, function (err, rows) {
        if (err) {
            return done(err, null);
        }
        else {
            if (rows[0] === undefined) {

                return done(error404, null);
            }
            else {
                let id = rows[0].user_id;
                let username = rows[0].username;
                let location = rows[0].location;
                let email = rows[0].email;
                let values = {
                    "id": id,
                    "username": username,
                    "location": location,
                    "email": email
                };
                return done(null, values);
            }
        }
    });
};

exports.insert = function (value, done) {
    let name = value['name'];
    let password = value['password'];
    let location = value['location'];
    if (location !== null){
        location = location.toString();
    }
    let email = value['email'];
    if(email !== null){
        email = email.toString();
    }
    let values = [name, password, location, email];
    console.log(values);
    let sql = 'INSERT INTO User (username, password, location, email) VALUES (?, ?, ?, ?)';
    db.get().query(sql, values, function (err, result) {
        if (name.length === 0 || password.length === 0){
            done(error400);
        }
        else {
            done(result);
        }

    });

 };

exports.alter = function (value, done) {

    let username = value['username'];
    let location = value['location'];
    let email = value['email'];
    let password = value['password'];



    db.get().query('UPDATE User SET username = ?, password = ?, location = ?, email = ?;',
        [username, password, location, email], function (err, result) {
            if (err) return done(err, null);
            else {
                return done(null, result);
            }


    });


};


// exports.remove = function (userId, login, done) {
//     if (userId != login){
//         return done(error403, null);
//     }
//     else {
//         db.get().query('SELECT * FROM User WHERE user_id = ?;', userId, function (err, result) {
//             if (err) return done(err, null);
//             else {
//
//             }
//         })
//     }
//     db.delete().query('DELETE FROM Users WHERE user_id=?', [userId], function (err, result) {
//         if (err) return done(err);
//         done(result);
//     })
//
// };

exports.login1 = function (username, password ,done) {
    async.waterfall([
        function (next) {

            db.get().query('SELECT * FROM User WHERE username = ?', username, function (err, result) {
                if (err) {
                    console.log(err);
                    next(err, null);

                }
                else {
                    if (result[0] == undefined){
                        next(error400, null);

                    }
                    else if (result[0].password != password){
                        next(error400, null);

                    }
                    else {
                        next(null, result[0]);
                    }

                }
            });
        },
        function (user ,next) {
            let user_id = user.user_id;
 //           let expires = expiresIn(7);
            let token = jwt.encode({
                iss: user_id
                // exp: expires
            }, '87654321', null);
            next(null, user_id, token);
        }
    ],
        function (err, user_id, token) {
            if(err) return done(err, null);
            else {
                db.post().query('INSERT INTO Token (user_id, token) VALUES (?, ?)', [user_id, token], function (err, result) {
                    if(err) console.log(err);
                    else {
                        let values = {
                            "id": user_id,
                            "token": token
                        };
                        return done(null, values);
                    }
                });
            }
        });
};

exports.logout1 = function (token, done) {
    db.delete().query('DELETE FROM Token WHERE token = ?;', token, function (err, result) {
        if (err) return done(err, null);
        else {
            return done(null, result);
        }
    })
};