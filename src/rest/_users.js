const Router = require('@koa/router');
const userService = require('../service/users');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const role = require('../core/roles');

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const response = await userService.login(email, password);
  ctx.body = response;
};

const register = async (ctx) => {
  ctx.body = await userService.register({
    ...ctx.request.body,
  });
  ctx.status = 201;
};

const getAllUsers = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await userService.getAll(limit, offset);
};

const getUserById = async (ctx) => {
  ctx.body = await userService.getById(ctx.params.id);
};

const updateUser = async (ctx) => {
  ctx.body = await userService.updateById(ctx.params.id, {
    ...ctx.request.body,
  });
};

const deleteUser = async (ctx) => {
  ctx.body = await userService.deleteById(ctx.params.id);
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/users',
  });

  router.post('/login', login);
  router.post('/register', register);

  const requireAdmin = makeRequireRole(role.ADMIN);

  router.get('/', requireAuthentication, requireAdmin, getAllUsers);
  router.get('/:id', requireAuthentication, getUserById);
  router.put('/:id', requireAuthentication, updateUser);
  router.delete('/:id', requireAuthentication, deleteUser);

  app.use(router.routes()).use(router.allowedMethods());
};