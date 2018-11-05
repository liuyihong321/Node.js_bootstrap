/**
 * Created by yli227 on 7/08/17.
 */
const User = require('../models/user.server.model');
const jwt = require('jwt-simple');



exports.create = function (req, res) {
    let values = {
        "name": req.body.username,
        "password": req.body.password,
        "location": req.body.location,
        "email": req.body.email
    };
    User.insert(values, function (result) {
        if(result.message === 400) {
            res.status(400).send('Malformed request');
        }
        else{
            res.status(200).json(result);
        }
    });
};

exports.read = function (req, res) {
    let user_id = req.params.userId;

    User.getOne(user_id, function (err, result) {
        if(err){
            if(err.message === 404){
                res.status(404).send('User not found');
            }
            else {
                res.status(400).send('Invalid id supplied');
            }
        }
        else {
            res.status(200).json(result);
        }
    });
};

exports.update = function (req, res) {
    // let token = req.get('X-Authorization');
    // let decode = jwt.decode(token, '87654321');
    let user_data = {
        // "login": decode.iss,
        // "id": req.body.userId,
        "username": req.body.username,
        "location": req.body.location,
        "email": req.body.email,
        "password": req.body.password
    };

    User.alter(user_data, function (err, result) {
        console.log(err);
        console.log(result);
        if (err) {
            if (err){
                res.status(401).send('Unauthorized - not logged in');
            }
            else {
                res.status(200).send(result);
            }
        }
    });
};


exports.login = function (req, res) {
    let username = req.query.username;
    let password = req.query.password;
    User.login1(username, password, function (err, result) {
        if (err){
            res.status(400).send('Invalid username/password supplied');
        }
        else {

            res.status(200).send(result);
        }
    })
};

exports.logout = function (req, res) {
    let token = req.get('X-Authorization');

    User.logout1(token, function (err, result) {

        if (err) res.status(401).send('Unauthorized - already logged out');
        else {
            res.status(200).send(result);
        }
    })
};
