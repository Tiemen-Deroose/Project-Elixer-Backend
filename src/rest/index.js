const Router = require('@koa/router');
const installArtRouter = require('./_art');
const installJewelryRouter = require('./_jewelry');
const installUserRouter = require('./_user');

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installArtRouter(router);
  installJewelryRouter(router);
  installUserRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};