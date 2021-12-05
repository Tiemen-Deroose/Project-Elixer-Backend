const Router = require('@koa/router');
const jewelryService = require('../service/jewelry');

const getAllJewelry = async (ctx) => {
  ctx.body = await jewelryService.getAll();
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
  ctx.status = 204;
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

  router.get('/', getAllJewelry);
  router.post('/', createJewelry);
  router.get('/:id', getJewelryById);
  router.put('/:id', updateJewelry);
  router.delete('/:id', deleteJewelry);
  router.get('/images/:image', getImageByPath);

  app.use(router.routes()).use(router.allowedMethods());
};