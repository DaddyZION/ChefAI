// Note: For production, you should use a proper database like Vercel KV, Supabase, or PlanetScale
// This uses localStorage on the client side since Vercel serverless functions are stateless

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    // Plans are stored in localStorage on client
    return res.json({ 
      success: false, 
      error: 'Plan not found on server. Plans are stored locally in your browser.' 
    });
  }

  if (req.method === 'DELETE') {
    // Plans are stored in localStorage on client
    return res.json({ success: true, message: 'Delete handled locally' });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
