const Router = require('@koa/router');
const installArtRoutes = require('./_art');
const installJewelryRoutes = require('./_jewelry');
const installUsersRoutes = require('./_users');

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installArtRoutes(router);
  installJewelryRoutes(router);
  installUsersRoutes(router);

  app.use(router.routes()).use(router.allowedMethods());
};