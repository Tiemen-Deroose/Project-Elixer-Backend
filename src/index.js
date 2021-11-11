const Koa = require('koa');
const config = require('config');
const winston = require('winston');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');

const app = new Koa();
app.use(bodyParser());

const NODE_ENV = config.get('env');
const LOGGER_SILENT = config.get('logger.silent');

const logger = winston.createLogger({
    silent: LOGGER_SILENT,
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' })
    ]
});

const {ART_DATA, JEWELRY_DATA} = require('./data/mock-data');

const router = new Router();
app.use(router.routes()).use(router.allowedMethods());

router.get('/api/art', async (ctx) => {
    logger.info('Request:', { message: ctx.URL });
    ctx.body = ART_DATA;
})
router.get('/api/jewelry', async (ctx) => {
    logger.info('Request:', { message: ctx.URL });
    ctx.body = JEWELRY_DATA;
})

app.listen(9000);
logger.info("Listening on port 9000...");