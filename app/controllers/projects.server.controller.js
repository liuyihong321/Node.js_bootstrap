const Project = require('../models/projects.server.model');
const jwt = require('jwt-simple');

exports.list = function (req, res) {
    Project.getAll(function (result) {
        res.status(200).json(result);
    });
};




exports.read = function (req, res) {
    let pro_id = req.params.userId;
    Project.getOne(pro_id, function (err, result) {
        if (err) res.status(404).send('Not found');
        else {
            res.status(200).send(result);
        }
    });
};

exports.view_uri = function (req, res) {
    let pro_id = req.params.userId;
    Project.view_image(pro_id, function (err, result) {
        if (err){
            if (err.message === 404){
                res.status(404).send('Not found');
            }
            else {
                res.status(400).send('Malformed request');
            }
        }
        else {
            res.writeHead(200, {'Content-Type': 'image/jpg'});
            res.write(result, 'binary');
            res.end();
        }
    })
};

exports.update_uri = function (req, res) {
  let pro_id = req.params.pro_id;
  let token = req.get('X-Authorization');
  let decode = jwt.decode(token, '87654321');
  let id = decode.iss;
  let image = require('image.jpg');
  fs.readFile(image, 'binary', function (err, result) {
      if (err) res.status(400).send('Malformed request');
      else {
          Project.update_image(pro_id, id, result, function (err, output) {
              if (err){
                  if (err.message === 403){
                      res.status(403).send('Forbidden - unable to update a project you do not own');
                  }
                  else {
                      res.status(404).send('Not found');
                  }
              }
              else {
                  res.status(201).send(output);
              }
          })
      }
  })

};

exports.project_update = function (req,res) {
    let pro_id = req.params.pro_id;
    let token = req.get('X-Authorization');
    let decode = jwt.decode(token, '87654321');
    let id = decode.iss;

    Project.alter(id, pro_id, function (err, result) {
        if (err){
            if (err.message === 403){
                res.status(403).send('Forbidden - unable to update a project you do not own');
            }
            else if (err.message === 404){
                res.status(404).send('Not found');
            }
            else {
                res.status(400).send('Malformed request');
            }
        }
        else {
            res.status(200).send(result);
        }
    })
};

exports.create = function (req, res) {
    let token = req.get('X-Authorization');
    let decode = jwt.decode(token, '87654321');
    let id = decode.iss;
    let project = {
        "title": req.body.title,
        "subtitle": req.body.subtitle,
        "description": req.body.description,
        "imageUri": req.body.imageUri,
        "target": req.body.target,
        "creators": req.body.creators,
        "rewards": req.body.rewards
    };
    console.log(project);
    Project.insert(id, project, function (err, result) {
        if (err){
            if (err.message === 401){
                res.status(401).send('Unauthorized - create account to create project');
            }
            else{
                res.status(200).json(result);
            }
        }
    })
};