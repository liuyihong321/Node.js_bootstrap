const db = require('../../config/db');
const async = require('async');
const fs = require('fs');


let error400 = new Error('400');
let error401 = new Error('401');
let error403 = new Error('403');
let error404 = new Error('404');

exports.getAll = function (done) {
    db.get().query('SELECT * FROM Project;', function (err, rows) {
        if (err) return done(err);
        else {
            let projects = [];
            for(let item of rows){
                let pro_id = item.pro_id;
                let title = item.title;
                let subtitle = item.subtitle;
                let imageUri = item.imageUri;
                let single = {
                    "id": pro_id,
                    "title": title,
                    "subtitle": subtitle,
                    "imageUri": imageUri
                };
                projects.push(single);
            }
            return done(projects);
        }
    });
};

exports.getOne = function (pro_id, done) {
    let creators =[];
    let rewards = [];
    let backers = [];
    db.get().query('SELECT * FROM Project WHERE pro_id = ?;', pro_id, function (err, result) {
        if (err) return done(err, null);
        else {

            let creationDate = result[0].creationDate;
            let title = result[0].title;
            let subtitle = result[0].subtitle;
            let pro_desc = result[0].pro_desc;
            let imageUri = result[0].imageUri;
            let target = result[0].target;
            let currentPledge = result[0].currentPledge;
            let num_Backers = result[0].num_Backers;
            async.waterfall([
                function (next) {
                    db.get().query('SELECT * FROM Creator WHERE pro_id = ?;', pro_id, function (err, row) {

                        if (err) next(err, null);
                        else {
                            for (let item of row){
                                let creator_id = item.create_id;
                                let creator_name = item.create_name;
                                let creator = [creator_id, creator_name];
                                creators.push(creator);
                            }
                            next(null, creators);
                        }
                        // console.log(creators);
                    });

                },
                function (creators, next) {
                    db.get().query('SELECT * FROM Reward WHERE pro_id = ?;', pro_id, function (err, row2) {
                        if (err) next(err, null, null);
                        else {
                            for (let item2 of row2){
                                let rew_id = item2.rew_id;
                                let rew_amount = item2.rew_amount;
                                let rew_desc = item2.rew_desc;
                                let reward = [rew_id, rew_amount, rew_desc];
                                rewards.push(reward);
                            }
                            next(null, creators, rewards);
                        }
                    });
                },
                function (creators, rewards, next) {
                    db.get().query('SELECT * FROM Pledge WHERE backer_id = ?;', pro_id, function (err, row3) {
                        if (err) next(err, null, null, null);
                        else {
                            for (let item3 of row3){
                                let backer_id = item3.backer_id;
                                let ple_amount = item3.ple_amount;
                                let backer = [backer_id, ple_amount];
                                backers.push(backer);
                            }
                            next(null, creators, rewards, backers);
                        }
                    });
                }],
                function (err, creators, rewards, backers) {
                    let creators_output = [];
                    if (err) console.log(err);
                    else {
                        for (let cre of creators) {
                            let creator_output = {
                                "id": cre[0],
                                "name": cre[1],
                            };
                            creators_output.push(creator_output);

                        }
                        let rewards_output = [];
                        for (let rew of rewards){
                            let reward_output = {
                                "id": rew[0],
                                "amount": rew[1],
                                "description": rew[2]
                            };
                            rewards_output.push(reward_output);
                        }
                        let data_output = {
                            "title": title,
                            "subtitle": subtitle,
                            "description": pro_desc,
                            "imageUri": imageUri,
                            "target": target,
                            "creators": creators_output,
                            "rewards": rewards_output
                        };

                        let progress_output = {
                            "progress": {
                                "target": target,
                                "currentPledged": currentPledge,
                                "numberOfBackers": num_Backers
                            }
                        };
                        let backers_output = [];
                        for (back of backers){
                            let backer_output = {
                                "name": back[0],
                                "amount": back[1]
                            };
                            backers_output.push(backer_output);
                        }
                        let project_output = {
                            "id": pro_id,
                            "creationDate": creationDate,
                            "data": data_output,
                            "progress": progress_output,
                            "backers": backers_output
                        };
                        return done(null, project_output);
                    }
                });
    }
    })
};

exports.alter = function (login, pro_id, done) {
    db.get().query('SELECT open FROM Project WHERE pro_id = ?;', pro_id, function (err, result) {
        if (err) return done(err, null);
        else {
            if (result[0] == undefined){
                return done(error404, null);
            }
            else {
                let check = result[0].open;
                let status = 0;
                let open = 0;
                db.get().query('SELECT num_id FROM Creator WHERE pro_id = ?;', pro_id, function (err, row) {
                    if (err) return done(err, null);
                    else {
                        for (item of row){
                            for (let item of row){
                                if (item.num_id === login){
                                    status = 1;
                                }
                            }
                        }
                        if (status === 1){
                            if (check === 1){
                                open = 0;
                            }
                            else {
                                open = 1;
                            }
                            db.get().query('SELECT Project SET open = ? WHERE pro_id = ?', [open, pro_id], function (err, result) {
                                if (err) return done(err, null);
                                else {
                                    return done(null, result);
                                }
                            })
                        }
                        else {
                            return done(error403, null);
                        }
                    }
                })
            }
        }


    })
};

exports.view_image = function (pro_id ,done) {
  db.get().query('SELECT imageUri FROM Project WHERE pro_id = ?;', pro_id, function (err, result) {
      if (err) return done(err, null);
      else {
          if (result[0] === undefined){
              return done(error404, null);
          }
          let image = '../assignment1/image.jpg';
          fs.readFile(image, 'binary', function (err, result) {
              if (err) return done(err, null);
              else {
                  return done(null, result);
              }
          });
      }
  });
};

exports.update_image = function (pro_id, login, image, done) {
    db.get().query('SELECT num_id FROM Creator WHERE pro_id = ?;', pro_id, function (err, result) {
        let uri = '../assignment1/image.jpg';
        if (err) return done(err, null);
        else {
            if (result[0] === undefined){
                return done(error404, null);
            }
            else {
                let check = 0;
                for (let item of result){
                    if (item.num_id === login){
                        check = 1;
                    }
                }
                if (check === 1){
                    fs.writeFile(uri, image, 'binary', function (err, result) {
                        if (err) return done(err, null);
                        else {
                            return done(null, result);
                        }
                    });
                }
                else return done(error403, null);
            }
        }
    })
};

exports.insert = function (login, data, done) {
    let title = data['title'];
    let subtitle = data['subtitle'];
    let description = data['description'];
    let imageUri = data['imageUri'];
    let target = data['target'];
    let pro_id = '';
    rewards = [];
    creators = [];
    for (let reward of data['rewards']){
        let rew_id = reward['id'];
        let amount = reward['amount'];
        let description = reward['description'];
        rewards.push(rew_id, amount, description);
    }
    for (let creator of data['creators']){
        let cre_id = creator['id'];
        let name = creator['name'];
        creators.push(cre_id, name, pro_id);
    }
    let values = [title, subtitle, imageUri, target];
    let sql = 'INSERT INTO Project (title, subtitle, imageUri, target) VALUES (?, ?, ?, ?)';
    async.waterfall([
        function (next) {
            db.post().query(sql, values, function (err, result) {
                if (err) next(err, null);
                else {
                    next(null, 'success');
                }
            })
        },
        function (res, next) {
            db.post().query('SELECT pro_id FROM Project ORDER BY pro_id DESC LIMIT 1', function (err, result) {
                if (err) next(err, null);
                else {
                    let pro_id = parseInt(result[0].pro_id);
                    next(null, pro_id);
                }
            })
        },
        function (pro_id, next) {
            let value = [];
            db.get().query('SELECT user_id FROM User', function (err, result) {
                if (err) next(err, null, pro_id);
                else {
                    if (result[0] === undefined){
                        next(error401, null, pro_id);
                    }
                    else {
                        for (let creator of data['creators']){
                            let cre_id = creator['id'];
                            let cre_name = creator['name'];
                            value.push(cre_id, cre_name, pro_id);
                        }
                        next(null, value, pro_id);
                    }
                }
            })
        },
        function (value, pro_id, next) {
            db.post().query('INSERT INTO Creator (num_id, create_name, pro_id) VALUES (?)', [value], function (err, result) {
                if (err) next(err, pro_id);
                else {
                    next(null, pro_id)
                }
            })
        },
        function (pro_id, next) {
            if (data['rewards'] !== undefined){
                let reward1 = [];
                for (let reward of data['rewards']){
                    let rew_id = reward['id'];
                    let rew_amount = reward['amount'];
                    let rew_desc = reward['description'];
                    reward1.push(rew_id, rew_amount, rew_desc, pro_id);
                }
                db.post().query('INSERT INTO Reward (rew_id, rew_amount, rew_desc, pro_id) VALUES (?)', [reward1], function (err, result) {
                    if (err) next(err, result);
                    else {
                        next(null, result);
                    }
                })
            }
            else {
                next(null, pro_id);
            }
        }
    ],
    function (err, result) {
        if (err) console.log(err);
        else {
            done(err, null);
        }
    });

};