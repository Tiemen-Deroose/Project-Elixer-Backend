const Router = require('@koa/router');
const userService = require('../service/users');

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
  ctx.body = await userService.getAll();
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
  router.get('/', getAllUsers);
  router.get('/:id', getUserById);
  router.put('/:id', updateUser);
  router.delete('/:id', deleteUser);

  app.use(router.routes()).use(router.allowedMethods());
};