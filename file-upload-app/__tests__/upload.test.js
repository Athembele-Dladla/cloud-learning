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