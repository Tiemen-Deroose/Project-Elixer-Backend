const userService = require('../service/users');

module.exports.requireAuthentication = async (ctx, next) => {
  const { authorization } = ctx.headers;
  const { authToken, ...session } = await userService.checkAndParseSession(authorization);

  ctx.state.session = session;
  ctx.state.authToken = authToken;

  return next();
};

module.exports.makeRequireRole = (role) => async (ctx, next) => {
  const { roles = [] } = ctx.state.session;

  userService.checkRole(role, roles);
  return next();
};