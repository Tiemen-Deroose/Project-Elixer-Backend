const Koa = require('koa');
const koaCors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const { serializeError } = require('serialize-error');
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
const ServiceError = require('./core/serviceError');

const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');

const NODE_ENV = config.get('env');

const isDevelopment = NODE_ENV === 'development';

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

  app.use(async (ctx, next) => {
    const logger = getLogger();
    logger.debug(`${ctx.method} request: ${ctx.url}`);
    try {
      await next();
      logger.debug(`${ctx.method} result: ${ctx.status}`);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  });

  app.use(async (ctx, next) => {
    try {
      await next();

      if (ctx.status === 404) {
        ctx.body = {
          code: 'NOT_FOUND',
          message: `Unknown resource: ${ctx.url}`,
        };
      }
    } catch (error) {
      logger.error('Error occurred while handling a request', {
        error: serializeError(error),
      });

      let statusCode = error.status || 500;
      let errorBody = {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message : error.message,
        details: error.details,
        stack: isDevelopment ? error.stack : undefined,
      };

      if (error instanceof ServiceError) {
        if (error.isValidationFailed) statusCode = 400;
        if (error.isUnauthorized) statusCode = 401;
        if (error.isForbidden) statusCode = 403;
        if (error.isNotFound) statusCode = 404;
      }

      ctx.status = statusCode;
      ctx.body = errorBody;
    }
  });

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