const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
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

mongodb.initDB((err) => {
    if(err) {
        console.log("DB: "+ err);
    }
    else {
        app.listen(port, 
            () => {console.log(`Database init and server Running on port ${port}`)});
    }
});