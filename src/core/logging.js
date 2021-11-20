const winston = require('winston');
const config = require('config');
const LOGGER_SILENT = config.get('logger.silent');

const logger = winston.createLogger({
    silent: LOGGER_SILENT,
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' })
    ]
});

module.exports = logger;