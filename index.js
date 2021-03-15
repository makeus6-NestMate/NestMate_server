const express = require('./config/express');
const {logger} = require('./config/winston');

express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);