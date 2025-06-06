const Joi = require('joi');
const Router = require('@koa/router');
const validate = require('./_validation');
const artService = require('../service/art');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const role = require('../core/roles');

const getAllArt = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await artService.getAll(limit, offset);
};
getAllArt.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const createArt = async (ctx) => {
  ctx.body = await artService.create({
    ...ctx.request.body,
  });
  ctx.status = 201;
};
createArt.validationScheme = {
  body: {
    title: Joi.string().max(255),
    material: Joi.string().max(50),
    medium: Joi.string().max(50),
    size: Joi.string().max(50),
    image_url: Joi.string().uri(),
    price: Joi.number().min(0),
  },
};

const getArtById = async (ctx) => {
  ctx.body = await artService.getById(ctx.params.id);
};
getArtById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateArt = async (ctx) => {
  ctx.body = await artService.updateById(ctx.params.id, {
    ...ctx.request.body,
  });
};
updateArt.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    title: Joi.string().max(255),
    material: Joi.string().max(50),
    medium: Joi.string().max(50),
    size: Joi.string().max(50),
    image_url: Joi.string().uri(),
    price: Joi.number().min(0),
  },
};

const deleteArt = async (ctx) => {
  await artService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteArt.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/art',
  });

  const requireAdmin = makeRequireRole(role.ADMIN);

  router.get('/', requireAuthentication, validate(getAllArt.validationScheme), getAllArt);
  router.post('/', requireAuthentication, validate(createArt.validationScheme), requireAdmin, createArt);
  router.get('/:id', requireAuthentication, validate(getArtById.validationScheme), getArtById);
  router.put('/:id', requireAuthentication, validate(updateArt.validationScheme), requireAdmin, updateArt);
  router.delete('/:id', requireAuthentication, validate(deleteArt.validationScheme), requireAdmin, deleteArt);

  app.use(router.routes()).use(router.allowedMethods());
};