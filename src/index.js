const defaultConfig = {
  database: {
    getUser: () => Promise.reject(
      new Error(
        'Function UserFindOne, not specified in the express-jwt-util(config)'
      )
    ),
    findQuery: { username: true },
    userIdField: '_id',
    comparePasswords: (dbPassword, requestPassword) => dbPassword === requestPassword
  },
  jwt: {
    secret: 'sekret'
  },
  session: {
    cookiePropId: '_id',
    // ---------------- hr | min | sec | mili
    timeToExpireSession: 1 * 60 * 60 * 1000,
  },
  messages: {
    tokenNotFound: 'No token provided.',
    tokenExpired: 'The session has expired.',
    failToAuthenticate: 'Could not authenticate.',
    userNotFound: 'The user is not valid.',
    wrongPassword: 'The password is incorrect.',
    loginSucess: 'Enjoy your token!',
    logout: 'logout'
  },
};

module.exports = (options = {}) => {
  const config = {
    database: {
      ...defaultConfig.database,
      ...options.database
    },
    session: {
      ...defaultConfig.session,
      ...options.session
    },
    jwt: {
      ...defaultConfig.jwt,
      ...options.jwt
    },
    messages: {
      ...defaultConfig.messages,
      ...options.messages
    }
  };
  const authenticate = require('./authenticate')(config);
  const authEnpoints = require('./auth-endpoints')({
    ...config,
    authenticate,
  });
  return {
    authenticate,
    authEnpoints
  };
};
