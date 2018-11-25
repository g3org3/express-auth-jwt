const express = require('express');
const expressAuthJWT = require('../src/index');
// Dependencies
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');

const app = express();
const port = process.env.PORT || 3000;

// Setup
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    resave: false,
    secret: 'keyboard cat',
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 3600,
    },
  })
);
app.use((req, res, next) => {
  req.jsonResponse = req.headers.accept === 'application/json';
  next();
});
const config = {
  database: {
    getUser: () =>
      Promise.resolve({
        _id: '95fec9bf-5baa-4ccf-aa3b-c0cfea46bdff',
        username: 'admin',
        password: 'admin',
        name: 'admin',
      }),
  },
};

// Using the module
const { authEndpoints, authenticate } = expressAuthJWT(config);
app.use(authEndpoints);

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/secret/route', authenticate, (req, res) => res.json('this is private'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
