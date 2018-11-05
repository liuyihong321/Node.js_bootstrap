/**
 * Created by yli227 on 7/08/17.
 */
const express = require('express'),
    bodyParser = require('body-parser');

module.exports = function () {
    const test = express();

    test.use(bodyParser.urlencoded({
        extend:true
    }));
    test.use(bodyParser.json());
    require('../app/routes/users.server.routes.js')(test);
    require('../app/routes/rewards.server.routes.js')(test);
    require('../app/routes/projects.server.routes.js')(test);

    return test;
};
