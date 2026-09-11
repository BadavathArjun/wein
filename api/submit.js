// Vercel Serverless Function: /api/submit
// Receives doctor intake data and generates confirmation ID for direct WhatsApp routing

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle POST submission
  if (req.method === 'POST') {
    try {
      let data = req.body;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          // already parsed or raw text
        }
      }

      const doctorName = data?.identity?.fullName || 'Doctor';
      const submissionId = `DOC-${Date.now().toString().slice(-6)}`;

      console.log(`📥 Intake received for ${doctorName} (ID: ${submissionId}) -> Forwarding directly to WhatsApp (+91 9493690611)`);

      return res.status(200).json({
        success: true,
        message: 'Doctor intake data received successfully! Routing directly to WhatsApp.',
        submissionId
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payload'
      });
    }
  }

  // Default GET handler
  return res.status(200).json({
    status: 'online',
    service: 'DocFolio Medical Intake API',
    whatsapp: '+91 9493690611'
  });
}
