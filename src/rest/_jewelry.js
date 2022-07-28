const Router = require('@koa/router');
const jewelryService = require('../service/jewelry');
const { requireAuthentication } = require('../core/auth');

const getAllJewelry = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await jewelryService.getAll(limit, offset);
};

const createJewelry = async (ctx) => {
  ctx.body = await jewelryService.create({
    ...ctx.request.body,
  });
  ctx.status = 201;
};

const getJewelryById = async (ctx) => {
  ctx.body = await jewelryService.getById(ctx.params.id);
};

const updateJewelry = async (ctx) => {
  ctx.body = await jewelryService.updateById(ctx.params.id, {
    ...ctx.request.body,
  });
};

const deleteJewelry = async (ctx) => {
  ctx.body = await jewelryService.deleteById(ctx.params.id);
};

const getImageByPath = async (ctx) => {
  const { src, mimeType } = await jewelryService.getImageByPath(`./images/jewelry/${ctx.params.image}`);

  ctx.body = src;
  ctx.response.set('content-type', mimeType);
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/jewelry',
  });

  router.get('/', requireAuthentication, getAllJewelry);
  router.post('/', requireAuthentication, createJewelry);
  router.get('/:id', requireAuthentication, getJewelryById);
  router.put('/:id', requireAuthentication, updateJewelry);
  router.delete('/:id', requireAuthentication, deleteJewelry);
  router.get('/images/:image', requireAuthentication, getImageByPath);

  app.use(router.routes()).use(router.allowedMethods());
};