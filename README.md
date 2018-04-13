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
const exampleConfig = {
  pkg: null, // package.json
  pe: null, // pretty-error
  secret: "change this secret",
  cookiePropId: "_id",
  // ---------------- hr | min | sec | mili
  timeToExpireSession: 1 * 60 * 60 * 1000,
  UserFindOne: () =>
    Promise.resolve({
      _id: "95fec9bf-5baa-4ccf-aa3b-c0cfea46bdff",
      username: "admin",
      password: "admin"
    }),
  userIdField: "_id",
  messages: {
    tokenNotFound: "No token provided.",
    tokenExpired: "La sesion ha expirado.",
    failToAuthenticate: "No se pudo autenticar la sesion",
    userNotFound: "El usuario no es valido.",
    wrongPassword: "Contraseña no es valida",
    loginSucess: "Enjoy your token!",
    logout: "logout"
  }
};

const {
  asyncHandler,
  authenticate,
  authEnpoints
} = require("express-jwt-util")(config);

// DEPS
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");

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
