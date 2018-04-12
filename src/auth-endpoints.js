const jwt = require('jsonwebtoken');
const asyncHandler = require('./async-handler');
const defaultMessages = {
  userNotValid: 'Usuario no valido.',
  wrongPassword: 'Contraseña no es valida.',
};

module.exports = ({
  router,
  authenticate,
  secret,
  cookiePropId,
  timeToExpireSession,
}) => {
  router.get('/auth', (req, res) => res.json({ status: 'up' }));
  router.get('/auth/me', authenticate, (req, res) => {
    const { user } = req;
    res.json({ profile: user });
  });
  router.get('/auth/logout', (req, res) => {
    res.cookie(cookiePropId, '', { maxAge: 0 });
    res.json({
      statusCode: 200,
      message: 'logout',
    });
  });

  router.get('/auth/login', authenticate, (req, res) => {
    res.cookie(cookiePropId, req.query.token);
    res.json(req.query.token);
  });

  const generateTokenHandler = user => {
    const today = Date.now();
    const expire = today + timeToExpireSession;
    const { _id } = user;
    return jwt.sign({ public: _id, expire }, secret, {});
  };

  router.post(
    '/auth/token',
    asyncHandler(async req => {
      const { username, password } = req.body;
      const user = await UserFindOne({ username });
      if (!user) {
        throw new Error(defaultMessages.userNotValid);
      }
      if (user.password !== password) {
        throw new Error(defaultMessages.wrongPassword);
      }

      delete user.password;
      const token = generateTokenHandler();
      res.cookie(cookiePropId, token);

      return res.json({
        statusCode: 200,
        message: 'Enjoy your token!',
        token: token,
      });
    }),
  );
  return router;
};
