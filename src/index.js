const Koa = require('koa');
const winston = require('winston');
const MOCK_DATA = require('./data/mock-data');

const app = new Koa();
const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });


app.use(async (ctx, next) => {
    ctx.body = MOCK_DATA;
    logger.info('URL Request:', { message: ctx.URL });
    await next();
});

app.listen(9000);
logger.info("Listening on port 9000...");