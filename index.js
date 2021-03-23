const express = require('./config/express');
const {logger} = require('./config/winston');

//const port = 3000;
express().listen(process.env.PORT||4000);
//logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
