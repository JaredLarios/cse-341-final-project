const swaggerAutogen = require('swagger-autogen');
const dotenv = require('dotenv');

const doc = {
    info: {
        title: "Library API",
        description: "Library database for cse final porject",
    },
    host: 'cse-341-final-project-3uvz.onrender.com',
    schemes: ["https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);