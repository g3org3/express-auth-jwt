# 🚓🍪 express-auth-jwt

## Getting Started

You will need Node >= 7 installed. [How do I install node? click here to find out about nvm](https://github.com/creationix/nvm#installation)

### Installation

```sh
# install module
npm install express-auth-jwt

# install deps
npm install jsonwebtoken body-parser cookie-parser cookie-session

# all in one command
npm install express-auth-jwt jsonwebtoken body-parser cookie-parser cookie-session
```

## Example
[see examples][link_examples]
- [simplest example][link_simplest-example]

## Generated Endpoints

| Method | Endpoint        | Body Params         | Description
|--------|-----------------|---------------------|-------------------------
| GET    | `/auth`         | -                   | simple check to verify the setup was succesful
| GET    | `/auth/me`      | -                   | returns the user's profile
| GET    | `/auth/logout`  | -                   | removes the session
| POST   | `/auth/token`   | `{ _id, password }` | to request a new JWT token and creates the session 

- `GET /auth/login?token=JWT`

## Default config
```js
const defaultConfig = {
  database: {
    getUser: () =>
      Promise.reject(
        new Error('Function UserFindOne, not specified in the express-jwt-util(config)')
      ),
    findQuery: { username: true },
    userIdField: '_id',
    comparePasswords: (dbPassword, requestPassword) => dbPassword === requestPassword,
  },
  jwt: {
    secret: 'sekret',
    // ---------------- hr | min | sec | mili
    timeToExpire: 1 * 60 * 60 * 1000,
  },
  cookie: {
    name: 'EAU_cid',
  },
  session: {
    resave: false,
    secret: 'keyboard cat',
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 3600,
    },
  },
  messages: {
    tokenNotFound: 'No token provided.',
    tokenExpired: 'The session has expired.',
    failToAuthenticate: 'Could not authenticate.',
    userNotFound: 'The user is not valid.',
    wrongPassword: 'The password is incorrect.',
    loginSucess: 'Enjoy your token!',
    logout: 'logout',
  },
};
```

## FAQs
```js
// if you want to use email or username
// you need to modify on the initial config
const config = {
  database: {
    userIdField: ‘email’
  }
}

......expressAuthJWT(config)
```

## Contributors

- George <mailto:7jagjag@gmail.com>

[link_examples]:https://github.com/g3org3/express-auth-jwt/blob/master/examples
[link_simplest-example]:https://github.com/g3org3/express-auth-jwt/blob/master/examples/server-simplest.js
