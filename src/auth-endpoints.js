const jwt = require('jsonwebtoken');
const router = require('express').Router()

module.exports = ({
  authenticate,
  secret,
  cookiePropId,
  timeToExpireSession,
  asyncHandler,
  UserFindOne,
  findQuery,
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

  router.post('/auth/token', asyncHandler(async (req, res) => {
      const { password } = req.body;
      const query = Object.keys(req.body)
        .filter(field => findQuery[field])
        .reduce((_q, key) => ({ ..._q, [key]: req.body[key] }), {})
      const user = await UserFindOne(query);
      if (!user) {
        const err = new Error(messages.userNotFound);
        err.statusCode = 404
        throw err
      }
      if (user.password !== password) {
        const err = new Error(messages.wrongPassword);
        err.statusCode = 400
        throw err
      }

      delete user.password;
      const token = generateToken(user);
      res.cookie(cookiePropId, token);

      return {
        statusCode: 200,
        message: messages.loginSuccess,
        token: token,
      }
    }),
  );
  return router;
};
