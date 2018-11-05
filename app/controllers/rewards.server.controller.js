const Reward = require('../models/rewards.server.model');

exports.view_reward = function (req, res) {
    let pro_id = req.params.id;
    Reward.getOne(pro_id, function (err, result) {
        if(err){
            if(err.message === 404){
                res.status(404).send('User not found');
            }
            else {
                res.status(404).send('User not found');
            }
        }
        else {
            res.status(200).json(result);
        }
    })
};

exports.update_reward = function (req, res) {
    let token = req.get('X-Authorization');
    let decode = jwt.decode(token, '87654321');
    let login = decode.iss;
    let pro_id = req.params.id;
    let rewards = [];
    for (let item of req.body){
        let rew_id = item.id;
        let amount = item.amount;
        let description = item.description;
        let reward = [rew_id, amount, description];
        rewards.push(reward)
    }
    Reward.update(login, pro_id, rewards, function (err, result) {
        if (err){
            if (err.message === 400){
                res.status(400).send('Malformed request');
            }
            else if (err.message === 403){
                res.status(403).send('Forbidden - unable to update a project you do not own');
            }
            else {
                res.status(404).send('Not found');
            }
        }
        else {
            res.status(200).send(result);
        }
    })
};