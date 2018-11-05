const db = require('../../config/db');
let error400 = new Error('400');
let error401 = new Error('401');
let error403 = new Error('403');
let error404 = new Error('404');
exports.getOne = function (pro_id, done) {
    db.get().query('SELECT * FROM Reward WHERE pro_id = ?', pro_id, function (err, rows){
        if (err) {
            return done(err, null);
        }
        else {
            if (rows[0] === undefined) {

                return done(error404, null);
            }
            else {
                let id = rows[0].rew_id;
                let amount = rows[0].rew_amount;
                let description = rows[0].rew_desc;
                let values = {
                    "id": id,
                    "amount": amount,
                    "description": description
                };
                return done(null, values);
            }
        }
    });

};

exports.update = function (login_id, pro_id, reward, done) {
    db.get().query('SELECT num_id FROM Creator WHERE pro_id = ?', pro_id, function (err, result) {
        if (err) return done(err, null);
        else {
            if (result[0] === undefined){
                return done(error404, null);
            }
            else {
                let check = 0;
                for (let item of login_id){
                    if(item.num_id !== login_id){
                        check = 1;
                    }
                }
                if (check === 1){
                    return done(error403, null);
                }
                else {
                    for (let rew of reward){
                        let output = db.put().query('UPDATE Reward SET rew_id = ?, rew_amount = ?, rew_desc = ?, pro_id = ?', [login_id, rew, reward, pro_id], function (err) {
                            if (err) return 'break';
                            else {
                                return 'OK';
                            }
                        });
                        if (output === 'break'){
                            return done(err, null);
                        }
                    }
                    return done(null, 'OK');
                }
            }
        }
    })
};