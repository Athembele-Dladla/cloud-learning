const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event) => {
  const short_code = event.queryStringParameters.code;

  const { data, error } = await supabase
    .from('urls')
    .select('original_url')
    .eq('short_code', short_code)
    .single();

  if (error || !data) {
    return { statusCode: 404, body: 'URL not found' };
  }

  return {
    statusCode: 301,
    headers: { Location: data.original_url }
  };
};