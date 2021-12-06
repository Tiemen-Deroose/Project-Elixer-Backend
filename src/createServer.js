const Koa = require('koa');
const koaCors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const config = require('config');
const {
  getLogger,
  initializeLogger,
} = require('./core/logging');
const {
  initializeData,
  shutdownData,
} = require('./data');
const installRest = require('./rest');

const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');

module.exports = async function createServer () {

  initializeLogger();

  await initializeData();

  const logger = getLogger();

  const app = new Koa();

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

  app.use(bodyParser());

  installRest(app);

  return {
    getApp(){
      return app;
    },

    start(){
      return new Promise((resolve) => {
        app.listen(9000);
        logger.info('🚀 Server listening on http://localhost:9000');
        resolve();
      });
    },

    async stop(){
      {
        app.removeAllListeners();
        await shutdownData();
        getLogger().info('Goodbye');
      }
    },
  };
};