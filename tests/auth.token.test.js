const createServer = require('../examples/server-simplest');
const { POST } = require('./utils');

describe('POST /auth/token', () => {
  let server = () => {};
  beforeAll(() => {
    server = createServer();
  });
  afterAll(() => {
    server.close();
  });

  it('should return the jwt token', async () => {
    const res = await POST(server, '/auth/token', { username: 'admin', password: 'admin' });
    const result = await res.json();

    expect(res.status).toBe(200);
    expect(result.statusCode).toBe(200);
    expect(result.token.length).toBe(200);
  });

  it('should return 403 with wrong password', async () => {
    const res = await POST(server, '/auth/token', { username: 'admin', password: 'bla' });
    const result = await res.json();

    expect(res.status).toBe(403);
    expect(result.statusCode).toBe(403);
    expect(result.message).toBe('The password is incorrect.');
  });
});
