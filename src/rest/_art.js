const Router = require('@koa/router');
const artService = require('../service/art');

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
  ctx.status = 204;
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

  router.get('/', getAllArt);
  router.post('/', createArt);
  router.get('/:id', getArtById);
  router.put('/:id', updateArt);
  router.delete('/:id', deleteArt);
  router.get('/images/:image', getImageByPath);

  app.use(router.routes()).use(router.allowedMethods());
};