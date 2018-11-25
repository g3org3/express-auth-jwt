const jwt = require('jsonwebtoken');

const verifyJWTPromise = ({ token, secret }) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, decoded) => (err ? reject(err) : resolve(decoded)))
  );

const authenticateToken = async ({ token, messages, jwt }) => {
  // verifies secret and checks exp
  const decoded = await verifyJWTPromise({ token, secret: jwt.secret });
  const today = Date.now();
  const timeLeft = decoded.expire - today;

  if (timeLeft <= 0) {
    const err = new Error(messages.tokenExpired);
    err.statusCode = 403;
    throw err;
  }

  return decoded.public;
};

const getUser = async ({ database, messages, _id }) => {
  const user = await database.getUser({ [database.userIdField]: _id });
  if (!user) {
    const err = new Error(messages.userNotFound);
    err.statusCode = 404;
    throw err;
  }
  // TODO: Make this optional
  user.password = undefined;
  return user;
};

const getToken = (req = {}, cookie) => {
  const body = req.body || {};
  const query = req.query || {};
  const cookies = req.cookies || {};
  const headers = req.headers || {};

  const token = body.token || query.token || headers['x-access-token'] || cookies[cookie.name];

  if (!token && req.headers.authorization) {
    const _token = req.headers.authorization
      .split('Bearer ')
      .filter(Boolean)
      .join();
    return _token !== req.headers.authorization ? _token : null;
  }

  return token;
};

const authenticateRoute = ({ cookie, database, messages, jwt }) => (req, res, next) => {
  const token = getToken(req, cookie);
  if (!token) {
    res.status(404);
    res.json({
      statusCode: 404,
      message: messages.tokenNotFound,
    });
  } else {
    Promise.resolve()
      .then(() => authenticateToken({ token, messages, jwt }))
      .then(_id => getUser({ _id, database, messages }))
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        console.log(err);
        const message = err.message;
        const statusCode = err.statusCode || 500;
        res.status(statusCode);
        res.json({ statusCode, message: message });
      });
  }
};

module.exports = authenticateRoute;
