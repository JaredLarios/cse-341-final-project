const swaggerAutogen = require('swagger-autogen');
const dotenv = require('dotenv');

const doc = {
    info: {
        title: "Movies API",
        description: "Movies database for cse project 2",
    },
    host: 'cse-341-final-project-3uvz.onrender.com',
    schemes: ["https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);