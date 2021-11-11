const Koa = require('koa');
const config = require('config');
const winston = require('winston');

const app = new Koa();

const NODE_ENV = config.get('env');
const LOGGER_SILENT = config.get('logger.silent');

const logger = winston.createLogger({
    silent: LOGGER_SILENT,
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' })
    ]
});

const MOCK_DATA = require('./data/mock-data');

app.use(async (ctx, next) => {
    ctx.body = MOCK_DATA;
    logger.info('Request:', { message: ctx.URL });
    await next();
});

app.listen(9000);
logger.info("Listening on port 9000...");