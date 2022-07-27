const Router = require('@koa/router');
const artService = require('../service/art');
const { requireAuthentication } = require('../core/auth');

const getAllArt = async (ctx) => {
  ctx.body = await artService.getAll();
};

const createArt = async (ctx) => {
  ctx.body = await artService.create({
    ...ctx.request.body,
  });
  ctx.status = 201;
};

const getArtById = async (ctx) => {
  ctx.body = await artService.getById(ctx.params.id);
};

const updateArt = async (ctx) => {
  ctx.body = await artService.updateById(ctx.params.id, {
    ...ctx.request.body,
  });
};

const deleteArt = async (ctx) => {
  ctx.body = await artService.deleteById(ctx.params.id);
};

const getImageByPath = async (ctx) => {
  const { src, mimeType } = await artService.getImageByPath(`./images/art/${ctx.params.image}`);

  ctx.body = src;
  ctx.response.set('content-type', mimeType);
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/art',
  });

  router.get('/', requireAuthentication, getAllArt);
  router.post('/', requireAuthentication, createArt);
  router.get('/:id', requireAuthentication, getArtById);
  router.put('/:id', requireAuthentication, updateArt);
  router.delete('/:id', requireAuthentication, deleteArt);
  router.get('/images/:image', requireAuthentication, getImageByPath);

  app.use(router.routes()).use(router.allowedMethods());
};