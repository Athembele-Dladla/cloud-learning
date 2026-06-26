const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { original_url } = JSON.parse(event.body);
  const short_code = Math.random().toString(36).substring(2, 8);

  const { error } = await supabase
    .from('urls')
    .insert([{ short_code, original_url }]);

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ short_code })
  };
};