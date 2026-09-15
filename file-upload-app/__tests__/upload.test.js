const { handler } = require('../netlify/functions/upload');

// Mock fetch globally
global.fetch = jest.fn();

describe('upload function', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
  });

  test('returns 405 for non-POST requests', async () => {
    const event = { httpMethod: 'GET' };
    const result = await handler(event);
    expect(result.statusCode).toBe(405);
    expect(result.body).toBe('Method Not Allowed');
  });

  test('returns 400 when Cloudinary returns an error', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ error: { message: 'Invalid image file' } })
    });

    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        file: 'data:image/png;base64,abc123',
        fileName: 'test.png',
        fileType: 'image/png'
      })
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe('Invalid image file');
  });

  test('returns 200 with file URL on successful upload', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/test.png',
        public_id: 'test',
        format: 'png',
        bytes: 1024,
        width: 100,
        height: 100
      })
    });

    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        file: 'data:image/png;base64,abc123',
        fileName: 'test.png',
        fileType: 'image/png'
      })
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.url).toBe('https://res.cloudinary.com/test-cloud/image/upload/test.png');
    expect(body.size).toBe(1024);
  });

});