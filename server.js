const express = require('express');
const bodyParser = require('body-parser');
//const mongodb = require('./db/connect');
const cors = require('cors');

const port = process.env.PORT || 8080;
const app = express();

app
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
    .use(cors({ origin: '*' }))
    .use('/', require('./routes'))
    .use((err, req, res, next) => {
        res
            .status(err.status || 500)
            .json({
                error: {
                    status: err.status || 500,
                    message: err.message
                }
            })
    })

app.listen(port, console.log(`Connected to DB and listening on ${port}`))

    /*
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`Connected to DB and listening on ${port}`);
    }
});
*/