const jwt = require('jsonwebtoken');
const errorMessages = {
  noTokenFound: {
    error: true,
    message: 'No token provided.',
  },
  expired: {
    error: true,
    message: 'No se pudo autenticar la sesion.',
  },
  failed: {
    error: true,
    message: 'Failed to authenticate',
  },
};
const verify = ({ token, secret }) =>
  new Promise((resolve, reject) =>
    jwt.verify(
      token,
      secret,
      (err, decoded) => (err ? reject(err) : resolve(decoded)),
    ),
  );

const jwtDBAuth = async ({ UserFindOne, token, secret }) => {
  // verifies secret and checks exp
  const decoded = await verify({ token, secret });
  const today = Date.now();
  const timeLeft = decoded.expire - today;

  if (timeLeft <= 0) {
    const err = new Error(errorMessages.expired);
    err.statusCode = 403;
    throw err;
  }

  const { _id } = decoded.public;
  const user = await UserFindOne({ _id });
  if (!user) {
    const err = new Error(errorMessages.failed);
    err.statusCode = 404;
    throw err;
  }
  user.password = undefined;
  user.__v = undefined;
  return user;
};

const getToken = (req = {}, cookiePropId) => {
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

const authenticateRoute = ({ secret, UserFindOne, cookiePropId = '_id' }) => (
  req,
  res,
  next,
) => {
  const token = getToken(req, cookiePropId);
  if (!token) {
    res.status(403);
    res.json(errorMessages.noTokenFound);
  } else {
    jwtDBAuth({ secret, UserFindOne, token })
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        const message = err.message;
        const statusCode = err.statusCode || 500;
        res.status(statusCode);
        res.json({ statusCode, message: err.message });
      });
  }
};

module.exports = authenticateRoute;
