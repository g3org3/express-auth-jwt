const defaultConfig = {
  pkg: null,
  pe: null,
  secret: 'secret',
  cookiePropId: '_id',
  // ---------------- hr | min | sec | mili
  timeToExpireSession: 1 * 60 * 60 * 1000,
  UserFindOne: () =>
    Promise.reject(
      new Error(
        'Function UserFindOne, not specified in the express-jwt-util(config)'
      )
    ),
  messages: {
    tokenNotFound: 'No token provided.',
    tokenExpired: 'La sesion ha expirado.',
    failToAuthenticate: 'No se pudo autenticar la sesion',
    userNotFound: 'El usuario no es valido.',
    wrongPassword: 'Contraseña no es valida',
    loginSucess: 'Enjoy your token!',
    logout: 'logout'
  }
};

module.exports = (options = {}) => {
  const config = { ...defaultConfig, options };
  const asyncHandler = require('./async-handler')(config);
  const authenticate = require('./authenticate')(config);
  const authEnpoints = require('./auth-endpoints')({
    ...config,
    authenticate,
    asyncHandler
  });
  return {
    asyncHandler,
    authenticate,
    authEnpoints
  };
};
