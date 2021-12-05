const Koa = require('koa');
const koaCors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const mime = require('mime-types');
const fs = require('fs');
const config = require('config');
const {
  initializeDatabase,
} = require('./data');

const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');

const {
  getLogger,
  initializeLogger,
} = require('./core/logging');

async function main() {

  initializeLogger();
  await initializeDatabase();

  const logger = getLogger();

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
    }),
  );

  const router = new Router();
  app.use(router.routes()).use(router.allowedMethods());

  const artService = require('./service/art');
  const jewelryService = require('./service/jewelry');

  router.get('/api/art', async (ctx) => {
    logger.info('GET Request:', {
      message: ctx.URL,
    });

    ctx.body = await artService.getAll();
  });
  router.get('/api/art/:id', async (ctx) => {
    logger.info('GET Request:', {
      message: ctx.URL,
    });

    const response = await artService.getById(ctx.params.id);
    ctx.body = response;
  });
  router.post('/api/art', async (ctx) => {
    logger.info('POST Request:', {
      message: ctx.URL,
    });

    const response = await artService.create({
      ...ctx.request.body,
    });
    ctx.body = response;
  });
  router.put('/api/art/:id', async (ctx) => {
    logger.info('PUT Request:', {
      message: ctx.URL,
    });

    const response = await artService.updateById(ctx.params.id, {
      ...ctx.request.body,
    });
    ctx.body = response;
  });
  router.delete('/api/art/:id', async (ctx) => {
    logger.info('DELETE Request:', {
      message: ctx.URL,
    });

    const response = await artService.deleteById(ctx.params.id);
    ctx.body = response;
  });

  router.get('/api/jewelry', async (ctx) => {
    logger.info('GET Request:', {
      message: ctx.URL,
    });

    ctx.body = await jewelryService.getAll();
  });
  router.get('/api/jewelry/:id', async (ctx) => {
    logger.info('GET Request:', {
      message: ctx.URL,
    });

    const response = await jewelryService.getById(ctx.params.id);
    ctx.body = response;
  });
  router.post('/api/jewelry', async (ctx) => {
    logger.info('POST Request:', {
      message: ctx.URL,
    });

    const response = await jewelryService.create({
      ...ctx.request.body,
    });
    ctx.body = response;
  });
  router.put('/api/jewelry/:id', async (ctx) => {
    logger.info('PUT Request:', {
      message: ctx.URL,
    });

    const response = await jewelryService.updateById(ctx.params.id, {
      ...ctx.request.body,
    });
    ctx.body = response;
  });
  router.delete('/api/jewelry/:id', async (ctx) => {
    logger.info('DELETE Request:', {
      message: ctx.URL,
    });

    const response = await jewelryService.deleteById(ctx.params.id);
    ctx.body = response;
  });

  router.get('/api/art/images/:image', async (ctx) => {
    logger.info('GET Request:', {
      message: ctx.URL,
    });

    var path = `./images/art/${ctx.params.image}`;
    var mimeType = mime.lookup(path);
    const src = fs.createReadStream(path);

    ctx.response.set('content-type', mimeType);
    ctx.body = src;
  });
  router.get('/api/jewelry/images/:image', async (ctx) => {
    logger.info('GET Request:', {
      message: ctx.URL,
    });

    var path = `./images/jewelry/${ctx.params.image}`;
    var mimeType = mime.lookup(path);
    const src = fs.createReadStream(path);

    ctx.response.set('content-type', mimeType);
    ctx.body = src;
  });

  app.listen(9000);
  logger.info('Listening on port 9000...');
}

main();