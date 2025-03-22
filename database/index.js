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

// ads of constants
const PORT = process.env.PORT || 8080;
const expressApp = express();

// workspace
expressApp.use(cors());
expressApp.use(express.json())
expressApp.use(express.static(path.resolve(__dirname, 'static')));
expressApp.use(fileUpload({}));
expressApp.use('/api', commonRouter);
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