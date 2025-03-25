// imports
require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');

const sequelize = require('./db');
const commonRouter = require('./routes/index');
const errorHandlerMiddleware = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const models = require('./model/models');
const cors = require('cors');

const os = require('os');
const hostname = os.hostname();

// ads of constants
const PORT = process.env.PORT || 8000;
const expressApp = express();

expressApp.get('/', (request, response) => response.send("Current host: " + hostname));

// workspace
expressApp.use(cors());
expressApp.use(express.json())
expressApp.use(express.static(path.resolve(__dirname, 'static')));
expressApp.use(fileUpload({}));
expressApp.use('/', commonRouter);
expressApp.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        expressApp.listen(PORT, () => console.log(`Successfully started on ${PORT} port`));
    } catch (error) {
        console.log(error);
    }
}

start();