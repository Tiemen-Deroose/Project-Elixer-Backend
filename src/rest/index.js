const Router = require('@koa/router');
const installArtRouter = require('./_art');
const installJewelryRouter = require('./_jewelry');

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installArtRouter(router);
  installJewelryRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};