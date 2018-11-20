const _jwt = require('jsonwebtoken');
const router = require('express').Router()

module.exports = ({ database, jwt, session, messages, authenticate }) => {
  // TODO: add optional prefix
  router.get('/auth', (req, res) => res.json({ status: 'up' }));

  router.get('/auth/me', authenticate, (req, res) => {
    const { user } = req;
    res.json({ profile: user });
  });

  router.get('/auth/logout', (req, res) => {
    res.cookie(session.cookiePropId, '', { maxAge: 0 });
    res.json({
      statusCode: 200,
      message: messages.logout,
    });
  });

  router.get('/auth/login', authenticate, (req, res) => {
    res.cookie(session.cookiePropId, req.query.token);
    res.json(req.query.token);
  });

  const generateToken = user => {
    const today = Date.now();
    const expire = today + session.timeToExpireSession;
    const _id = user[database.userIdField];
    return _jwt.sign({ public: _id, expire }, jwt.secret, {});
  };

  router.post('/auth/token', asyncHandler(async (req, res) => {
      const { password } = req.body;
      
      // create the object query -> { _id: 1234 }
      const query = Object.keys(req.body)
        .filter(field => database.findQuery[field])
        .reduce((_q, key) => ({ ..._q, [key]: req.body[key] }), {})
      
      // Search in the DB
      const user = await database.getUser(query);
      
      if (!user) {
        const err = new Error(messages.userNotFound);
        err.statusCode = 404
        throw err
      }

      if (!database.comparePasswords(user.password, password)) {
        const err = new Error(messages.wrongPassword);
        err.statusCode = 400
        throw err
      }

      // TODO: optinal? or custom name?
      delete user.password;
      const token = generateToken(user);
      res.cookie(session.cookiePropId, token);

      return {
        statusCode: 200,
        message: messages.loginSuccess,
        token,
      }
    }),
  );
  return router;
};
