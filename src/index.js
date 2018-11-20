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
    secret: 'sekret',
    // ---------------- hr | min | sec | mili
    timeToExpire: 1 * 60 * 60 * 1000
  },
  cookie: {
    name: 'EAU_cid'
  },
  session: {
    resave: false,
    secret: "keyboard cat",
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 3600
    }
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
    cookie: {
      ...defaultConfig.cookie,
      ...options.cookie
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
  const authEndpoints = require('./auth-endpoints')({
    ...config,
    authenticate,
  });
  return {
    authenticate,
    authEndpoints,
    setupExpressDependencies: setupExpressDependencies(config),
    setupExpress: setupExpressDependencies(config, authEndpoints)
  };
};

function setupExpressDependencies (config, authEndpoints) {
  return (app) => {
    const bodyParser = require("body-parser");
    const cookieParser = require("cookie-parser");
    const session = require("cookie-session");
    
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(
      session({
        ...config.session,
        cookie: {
          ...config.session.cookie,
        }
      })
    );
    app.use((req, res, next) => {
      req.jsonResponse = req.headers.accept === "application/json";
      next();
    });

    if (authEndpoints) app.use(authEndpoints);
  }
}
