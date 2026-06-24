exports.handler = async (event, context) => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Hello from Athembele's serverless function :)",
        platform: "Netlify Functions",
        timestamp: new Date().toISOString()
      })
    };
  };