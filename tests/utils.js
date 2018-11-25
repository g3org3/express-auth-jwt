const fetch = require('node-fetch');

exports.POST = (server, endpoint, data) => {
  const { port } = server.address();
  return fetch(`http://localhost:${port}${endpoint}`, {
    headers: { 'Content-type': 'application/json' },
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

exports.GET = (server, endpoint, headers = {}) => {
  const { port } = server.address();
  return fetch(`http://localhost:${port}${endpoint}`, {
    headers: {
      'Content-type': 'application/json',
      ...headers,
    },
  });
};

exports.getToken = async server => {
  let res = await exports.POST(server, '/auth/token', { username: 'admin', password: 'admin' });
  const { token } = await res.json();
  return token;
};

exports.mockUser = {
  _id: '95fec9bf-5baa-4ccf-aa3b-c0cfea46bdff',
  name: 'admin',
  username: 'admin',
};

exports.mockAuthMeResponse = {
  profile: exports.mockUser,
};
