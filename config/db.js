/**
 * Created by yli227 on 7/08/17.
 */
const mysql = require('mysql');
const state = {
    pool: null
};

exports.connect = function (done) {
    state.pool = mysql.createPool({
        host: process.env.SENG365_MYSQL_HOST || 'localhost',
        user: 'root',
        password: 'secret',
        port: process.env.SENG365_MYSQL_PORT || 6033,
        database: "mysql"
    });
    let table =
            'CREATE TABLE if not exists Project (' +
                'pro_id INT(15) AUTO_INCREMENT NOT NULL,' +
                'title varchar(20) NOT NULL,' +
                'subtitle varchar(20) NOT NULL,' +
                'imageUri varchar(150) NOT NULL,' +
                'pro_desc varchar(300),' +
                'target INT(15) NOT NULL,' +
                'currentPledge INT(30) default 0,' +
                'num_Backers INT(15) default 0,' +
                'creat_id INT(15),' +
                'creationDate  DATETIME DEFAULT CURRENT_TIMESTAMP,' +
                'open boolean default 1,' +
                'PRIMARY KEY (pro_id),' +
                'FOREIGN KEY (creat_id) REFERENCES User(user_id)' +
                ');' +
            'CREATE TABLE if not exists Reward (' +
                'rew_id INT(15) AUTO_INCREMENT NOT NULL,' +
                'rew_amount INT(25) NOT NULL,' +
                'rew_desc varchar(300),' +
                'pro_id INT(15),' +
                'PRIMARY KEY (rew_id),' +
                'FOREIGN KEY (pro_id) REFERENCES Project(pro_id)' +
                ');' +
                'CREATE TABLE User (' +
                'user_id INT(15) AUTO_INCREMENT NOT NULL,' +
                'username varchar(30) NOT NULL,' +
                'location varchar(100),' +
                'email varchar(30),' +
                'password varchar(30) NOT NULL,' +
                'PRIMARY KEY  (user_id)' +
                ');' +
            'CREATE TABLE if not exists Pledge (' +
                'ple_id INT(15) AUTO_INCREMENT NOT NULL,' +
                'ple_amount INT(25) NOT NULL,' +
                'anonymous boolean default 0,' +
                'authToken varchar(500) NOT NULL,' +
                'pro_id INT(15) NOT NULL,' +
                'user_id INT(15) NOT NULL,' +
                'backer_id INT(15) NOT NULL,' +
                'PRIMARY KEY (ple_id),' +
                'FOREIGN KEY (pro_id) REFERENCES Project(pro_id),' +
                'FOREIGN KEY (user_id) REFERENCES User(user_id)' +
                ');' +
            'CREATE TABLE if not exists Creator (' +
                'create_id INT(15) AUTO_INCREMENT NOT NULL,' +
                'num_id INT(15),' +
                'create_name varchar(30),' +
                'pro_id INT(15),' +
                'PRIMARY KEY (create_id),' +
                'FOREIGN KEY (num_id) REFERENCES User(user_id)' +
                ');' +
            'CREATE TABLE if not exists Token (' +
                'user_id INT(15),' +
                'token varchar(500),' +
                'PRIMARY KEY (user_id),' +
                'FOREIGN KEY (user_id) REFERENCES User(user_id)' +
            ');';
    state.pool.query(table, function (err, result) {
       if (err){
           console.log(err);
           state.pool.query('DROP DATABASE mysql');
       }
    });


    done();
};

exports.get = function () {
    return state.pool;
};

exports.post = function () {
    return state.pool;
};

exports.put = function () {
    return state.pool;
};

exports.delete = function () {
    return state.pool;
};