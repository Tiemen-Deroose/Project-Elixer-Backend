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

  app.use(router.routes()).use(router.allowedMethods());
};