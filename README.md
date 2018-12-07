# express-auth-jwt 🚓

# a node module

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

## Contributors

- George <mailto:7jagjag@gmail.com>

## Example
[see examples][link_examples]
- [simplest example][link_simplest-example]

## Auth Routes

- `GET` /auth
- `GET` /auth/me
- `GET` /auth/logout
- `GET` /auth/login?token=JWT
- `POST` /auth/token `{ _id, password }`

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

[link_examples]:https://github.com/g3org3/express-auth-jwt/blob/master/examples
[link_simplest-example]:https://github.com/g3org3/express-auth-jwt/blob/master/examples/server-simplest.js
