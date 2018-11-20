const jwt = require('jsonwebtoken');

const verifyJWTPromise = ({ token, secret }) =>
  new Promise((resolve, reject) =>
    jwt.verify(
      token,
      secret,
      (err, decoded) => (err ? reject(err) : resolve(decoded))
    )
  );

const authenticateToken = async ({ token, database, messages }) => {
  // verifies secret and checks exp
  const decoded = await verifyJWTPromise({ token, secret });
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
}

const getToken = (req = {}, cookiePropId = '') => {
  var body = req.body || {};
  var query = req.query || {};
  var cookies = req.cookies || {};
  var token =
    body.token ||
    query.token ||
    req.headers['x-access-token'] ||
    cookies[cookiePropId];
  return token;
};

const authenticateRoute = ({ session, database, messages }) => (req, res, next) => {
  const token = getToken(req, session.cookiePropId);
  if (!token) {
    res.status(403);
    res.json(messages.tokenNotFound);
  } else {
    Promise.resolve()
      .then(() => authenticateToken({ secret, UserFindOne, token, messages, userIdField }))
      .then(_id => getUser({ database, messages, _id }))
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        const message = err.message;
        const statusCode = err.statusCode || 500;
        res.status(statusCode);
        res.json({ statusCode, message: message });
      });
  }
};

module.exports = authenticateRoute;
