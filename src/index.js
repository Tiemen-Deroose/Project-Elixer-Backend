const Koa = require('koa');
const koaCors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const winston = require('winston');
const config = require('config');

const NODE_ENV = config.get('env');
const LOGGER_SILENT = config.get('logger.silent');
const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');

const app = new Koa();
app.use(bodyParser());

app.use(
	koaCors({
		origin: (ctx) => {
			if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
				return ctx.request.header.origin;
			}
			// Not a valid domain at this point, let's return the first valid as we should return a string
			return CORS_ORIGINS[0];
		},
		allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
		maxAge: CORS_MAX_AGE,
	})
);

const logger = winston.createLogger({
    silent: LOGGER_SILENT,
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' })
    ]
});

const router = new Router();
app.use(router.routes()).use(router.allowedMethods());

const artService = require('./service/art');
const jewelryService = require('./service/jewelry');

router.get('/api/art', async (ctx) => {
    logger.info('GET Request:', { message: ctx.URL });

    ctx.body = artService.getAll();
});
router.get('/api/art/:id', async (ctx) => {
    logger.info(`GET Request:`, { message: ctx.URL });

    const response = artService.getById(ctx.params.id);
    ctx.body = response;
});
router.post('/api/art', async (ctx) => {
    logger.info(`POST Request:`, { message: ctx.URL });

    const response = artService.create({...ctx.request.body});
    ctx.body = response;
});
router.put('/api/art/:id', async (ctx) => {
    logger.info(`PUT Request:`, { message: ctx.URL });
    
    const response = artService.updateById(ctx.params.id, {...ctx.request.body});
    ctx.body = response;
});
router.delete('/api/art/:id', async (ctx) => {
    logger.info(`DELETE Request:`, { message: ctx.URL });
    
    const response = artService.deleteById(ctx.params.id);
    ctx.body = response;
});

router.get('/api/jewelry', async (ctx) => {
    logger.info('GET Request:', { message: ctx.URL });

    ctx.body = jewelryService.getAll();
});
router.get('/api/jewelry/:id', async (ctx) => {
    logger.info(`GET Request:`, { message: ctx.URL });

    const response = jewelryService.getById(ctx.params.id);
    ctx.body = response;
});
router.post('/api/jewelry', async (ctx) => {
    logger.info('POST Request:', { message: ctx.URL });

    const response = jewelryService.create({...ctx.request.body});
    ctx.body = response;
});
router.put('/api/jewelry/:id', async (ctx) => {
    logger.info(`PUT Request:`, { message: ctx.URL });
    
    const response = jewelryService.updateById(ctx.params.id, {...ctx.request.body});
    ctx.body = response;
});
router.delete('/api/jewelry/:id', async (ctx) => {
    logger.info(`DELETE Request:`, { message: ctx.URL });
    
    const response = jewelryService.deleteById(ctx.params.id);
    ctx.body = response;
});

app.listen(9000);
logger.info("Listening on port 9000...");