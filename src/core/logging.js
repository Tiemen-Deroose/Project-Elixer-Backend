const { createLogger, transports } = require('winston');
const { format } = require('logform');
const { combine, timestamp, colorize, printf } = format;
const config = require('config');
const LOGGER_SILENT = config.get('logger.silent');

const printfFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    colorize(),
    timestamp(),
    printfFormat,
  ),
  silent: LOGGER_SILENT,
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;