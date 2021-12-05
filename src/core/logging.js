const { createLogger, transports } = require('winston');
const { format } = require('logform');
const { combine, timestamp, colorize, printf } = format;
const config = require('config');
const LOGGER_SILENT = config.get('logger.silent');

const customFormat = printf(({ name = 'server', level, message, timestamp }) => {
  return `[${timestamp}] ${name} | ${level}: ${message}`;
});

let logger;

const initializeLogger = () => {
  logger = createLogger({
    format: combine(
      colorize(),
      timestamp(),
      customFormat,
    ),
    silent: LOGGER_SILENT,
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'combined.log' }),
    ],
  });
};

const getLogger = () => {
  if (!logger) throw new Error('Logger has not yet been initialized');
  return logger;
};

const getChildLogger = (name, meta = {}) => {
  const previousName = getLogger().defaultMeta?.name;

  return getLogger().child({
    name: previousName ? `${previousName}.${name}` : name,
    previousName,
    ...meta,
  });
};

module.exports = {
  initializeLogger,
  getLogger,
  getChildLogger,
};