const createServer = require('../examples/server-simplest');
const { GET, getToken, mockAuthMeResponse } = require('./utils');

describe('GET /auth/me', () => {
  let server = () => {};
  beforeAll(() => {
    server = createServer();
  });
  afterAll(() => {
    server.close();
  });

  it('should return my profile ?token=', async () => {
    const token = await getToken(server);
    const res = await GET(server, '/auth/me?token=' + token);
    const result = await res.json();

    expect(res.status).toBe(200);
    expect(result).toEqual(mockAuthMeResponse);
  });

  it('should return my profile (Headers:x-access-token)', async () => {
    const token = await getToken(server);
    const res = await GET(server, '/auth/me', {
      'x-access-token': token,
    });
    const result = await res.json();

    expect(res.status).toBe(200);
    expect(result).toEqual(mockAuthMeResponse);
  });

  it('should return my profile (Headers:Authorization)', async () => {
    const token = await getToken(server);
    const res = await GET(server, '/auth/me', {
      Authorization: `Bearer ${token}`,
    });
    const result = await res.json();

    expect(res.status).toBe(200);
    expect(result).toEqual(mockAuthMeResponse);
  });

  it('should return 404 using wrong (Headers:Authorization)', async () => {
    const token = await getToken(server);
    const res = await GET(server, '/auth/me', {
      Authorization: `Bear ${token}`,
    });
    const result = await res.json();

    expect(res.status).toBe(404);
    expect(result.statusCode).toBe(404);
  });

  it('should return 404 with when no token found', async () => {
    const res = await GET(server, '/auth/me');
    const result = await res.json();

    expect(res.status).toBe(404);
    expect(result.statusCode).toBe(404);
    expect(result.message).toBe('No token provided.');
  });
});
