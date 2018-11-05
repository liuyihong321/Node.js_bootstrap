/**
 * Created by yli227 on 3/08/17.
 */
const db = require('./config/db'),
    express = require('./config/express');

const test = express();

// Connect to MySQL on start
db.connect(function (err) {
    if (err) {
        console.log('Unable to connect to MySQL.');
        process.exit(1);
    }
    else {
        test.listen(4941, function () {
            console.log('Listening on port: ' + 4941);
        });
    }
});