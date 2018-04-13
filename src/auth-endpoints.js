const jwt = require('jsonwebtoken');
const router = require('express').Router()

module.exports = ({
  authenticate,
  secret,
  cookiePropId,
  timeToExpireSession,
  asyncHandler,
  UserFindOne,
  messages = {}
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
      message: messages.logout,
    });
  });

  router.get('/auth/login', authenticate, (req, res) => {
    res.cookie(cookiePropId, req.query.token);
    res.json(req.query.token);
  });

  const generateToken = user => {
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
        throw new Error(messages.userNotFound);
      }
      if (user.password !== password) {
        throw new Error(messages.wrongPassword);
      }

      delete user.password;
      const token = generateToken();
      res.cookie(cookiePropId, token);

      return res.json({
        statusCode: 200,
        message: messages.loginSuccess,
        token: token,
      });
    }),
  );
  return router;
};
