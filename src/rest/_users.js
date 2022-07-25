const Router = require('@koa/router');
const userService = require('../service/users');

const getAllUsers = async (ctx) => {
  ctx.body = await userService.getAll();
};

const createUser = async (ctx) => {
  ctx.body = await userService.create({
    ...ctx.request.body,
  });
  ctx.status = 201;
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

  router.get('/', getAllUsers);
  router.post('/', createUser);
  router.get('/:id', getUserById);
  router.put('/:id', updateUser);
  router.delete('/:id', deleteUser);

  app.use(router.routes()).use(router.allowedMethods());
};