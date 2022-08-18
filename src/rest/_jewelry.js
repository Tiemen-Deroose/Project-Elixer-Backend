const Joi = require('joi');
const Router = require('@koa/router');
const validate = require('./_validation');
const jewelryService = require('../service/jewelry');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const role = require('../core/roles');

const getAllJewelry = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await jewelryService.getAll(limit, offset);
};
getAllJewelry.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const createJewelry = async (ctx) => {
  ctx.body = await jewelryService.create({
    ...ctx.request.body,
  });
  ctx.status = 201;
};
createJewelry.validationScheme = {
  body: {
    name: Joi.string().max(255),
    category: Joi.string().max(50),
    material: Joi.string().max(50),
    colour: Joi.string().max(50),
    image_url: Joi.string().uri(),
    price: Joi.number().min(0),
  },
};

const getJewelryById = async (ctx) => {
  ctx.body = await jewelryService.getById(ctx.params.id);
};
getJewelryById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateJewelry = async (ctx) => {
  ctx.body = await jewelryService.updateById(ctx.params.id, {
    ...ctx.request.body,
  });
};
updateJewelry.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    name: Joi.string().max(255),
    category: Joi.string().max(50),
    material: Joi.string().max(50),
    colour: Joi.string().max(50),
    image_url: Joi.string().uri(),
    price: Joi.number().min(0),
  },
};

const deleteJewelry = async (ctx) => {
  await jewelryService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteJewelry.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/jewelry',
  });

  const requireAdmin = makeRequireRole(role.ADMIN);

  router.get('/', validate(getAllJewelry.validationScheme), requireAuthentication, getAllJewelry);
  router.post('/', validate(createJewelry.validationScheme), requireAuthentication, requireAdmin, createJewelry);
  router.get('/:id', validate(getJewelryById.validationScheme), requireAuthentication, getJewelryById);
  router.put('/:id', validate(updateJewelry.validationScheme), requireAuthentication, requireAdmin, updateJewelry);
  router.delete('/:id', validate(deleteJewelry.validationScheme), requireAuthentication, requireAdmin, deleteJewelry);

  app.use(router.routes()).use(router.allowedMethods());
};