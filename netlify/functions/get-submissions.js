// Netlify Function: get-submissions
// Retorna as submissões do Netlify Forms para o form 'survey'.
// Exige as variáveis de ambiente NETLIFY_API_TOKEN e NETLIFY_SITE_ID configuradas no Netlify.

exports.handler = async function(event, context) {
  try {
    const token = process.env.NETLIFY_API_TOKEN;
    const siteId = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || process.env.NETLIFY_SITE;
    const formName = 'survey';

    if (!token || !siteId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'NETLIFY_API_TOKEN and NETLIFY_SITE_ID must be set in site environment variables' })
      };
    }

    const apiUrl = `https://api.netlify.com/api/v1/sites/${siteId}/forms/${formName}/submissions`;

    const resp = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: resp.status, body: text };
    }

    const submissions = await resp.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissions)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
