# express-jwt-util

# a node module

## Getting Started

You will need Node >= 7 installed. [How do I install node? click here to find out about nvm](https://github.com/creationix/nvm#installation)

### Installation

```sh
npm install express-jwt-util
```

# Usage

```sh

```

## Contributors

* George <mailto:7jagjag@gmail.com>

```js
const {
  asyncHandler,
  authenticateConf,
  authEnpointsConf
} = require("express-jwt-util");

// config
const secret = "secret";
const UserFindOne = () =>
  Promise.resolve({
    _id: "95fec9bf-5baa-4ccf-aa3b-c0cfea46bdff",
    username: "admin",
    password: "admin"
  });

// DEPS
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");

// TOOLS
const authenticate = authenticateConf({
  UserFindOne,
  secret
});
const authEnpoints = authEnpointsConf({
  router: express.Router(),
  secret,
  authenticate,
  cookiePropId: "_id",
  // ---------------- hr | min | sec | mili
  timeToExpireSession: 1 * 60 * 60 * 1000
});

// CONFIG
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    resave: false,
    secret: "keyboard cat",
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 3600
    }
  })
);
app.use((req, res, next) => {
  req.jsonResponse = req.headers.accept === "application/json";
  next();
});
app.use(authEnpoints);
```
