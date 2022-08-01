const Joi = require('joi');
const Router = require('@koa/router');
const validate = require('./_validation');
const userService = require('../service/users');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const role = require('../core/roles');

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const response = await userService.login(email, password);
  ctx.body = response;
};
login.validationScheme = {
  body: {
    email: Joi.string().email().max(255),
    password: Joi.string().max(255),
  },
};

const register = async (ctx) => {
  ctx.body = await userService.register({
    ...ctx.request.body,
  });
  ctx.status = 201;
};
register.validationScheme = {
  body: {
    username: Joi.string().max(50),
    email: Joi.string().email().max(255),
    password: Joi.string().max(255),
  },
};

const getAllUsers = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await userService.getAll(limit, offset);
};
getAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const getUserById = async (ctx) => {
  ctx.body = await userService.getById(ctx.params.id);
};
getUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateUser = async (ctx) => {
  ctx.body = await userService.updateById(ctx.params.id, {
    ...ctx.request.body,
  });
};
updateUser.validationScheme = {
  body: {
    username: Joi.string().max(50),
    email: Joi.string().email(),
    password: Joi.string().max(255),
    roles: Joi.array().items(Joi.string().valid(role.ADMIN, role.USER)),
  },
};

const deleteUser = async (ctx) => {
  ctx.status = await userService.deleteById(ctx.params.id) ? 204 : 404;
};
deleteUser.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/users',
  });

  router.post('/login', validate(login.validationScheme), login);
  router.post('/register', validate(register.validationScheme), register);

  const requireAdmin = makeRequireRole(role.ADMIN);

  router.get('/', validate(getAllUsers.validationScheme), requireAuthentication, requireAdmin, getAllUsers);
  router.get('/:id', validate(getUserById.validationScheme), requireAuthentication, getUserById);
  router.put('/:id', validate(updateUser.validationScheme), requireAuthentication, updateUser);
  router.delete('/:id', validate(deleteUser.validationScheme), requireAuthentication, deleteUser);

  app.use(router.routes()).use(router.allowedMethods());
};