exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
  
    const { file, fileName, fileType } = JSON.parse(event.body);
  
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
    const timestamp = Math.round(new Date().getTime() / 1000);
  
    const crypto = require('crypto');
    const signature = crypto
      .createHash('sha256')
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest('hex');
  
    const formData = `file=${encodeURIComponent(file)}&timestamp=${timestamp}&api_key=${apiKey}&signature=${signature}`;
  