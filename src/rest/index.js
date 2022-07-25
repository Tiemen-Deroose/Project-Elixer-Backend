const Router = require('@koa/router');
const installArtRouter = require('./_art');
const installJewelryRouter = require('./_jewelry');
const installUsersRouter = require('./_users');

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installArtRouter(router);
  installJewelryRouter(router);
  installUsersRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};