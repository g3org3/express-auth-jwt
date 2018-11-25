const createServer = require('../examples/server-simplest');
const { GET, getToken } = require('./utils');

describe('GET /auth/logout', () => {
  let server = () => {};
  beforeAll(() => {
    server = createServer();
  });
  afterAll(() => {
    server.close();
  });

  it('should logout', async () => {
    await getToken(server);
    const res = await GET(server, '/auth/logout');
    const result = await res.json();

    expect(res.status).toBe(200);
    expect(result).toEqual({ statusCode: 200, message: 'logout' });
  });
});
