const express = require('express');
const expressAuthJWT = require('../src/index');

const app = express();
const port = process.env.PORT || 3000;

// Custom Config
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
const { authEndpoints, authenticate, setupExpressDependencies } = expressAuthJWT(config);
// Setup the auth routes
setupExpressDependencies(app);
app.use(authEndpoints);

app.get('/', (req, res) => res.send('Hello World!'));

// authenticate a route
app.get('/secret/route', authenticate, (req, res) => res.json('this is private'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
