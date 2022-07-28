const { createLogger, transports } = require('winston');
const { format } = require('logform');
const { combine, timestamp, colorize, printf } = format;
const config = require('config');
const { silent: LOGGER_SILENT, level: LOGGER_LEVEL } = config.get('logger');

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
    level: LOGGER_LEVEL,
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'combined.log' }),
    ],
  });

  logger.info(`Logger initialized at log level '${LOGGER_LEVEL}'`);
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