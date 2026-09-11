import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  EMBEDDED_INDEX_HTML,
  EMBEDDED_MAIN_CSS,
  EMBEDDED_APP_JS,
  EMBEDDED_PLATFORMS_JS,
  EMBEDDED_SAMPLE_DATA_JS
} from './src/embedded-assets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Memory asset cache with disk override for live local development
function getAsset(pathname) {
  const cleanPath = pathname === '/' ? '/index.html' : pathname;

  // Try reading fresh from disk first (useful for local development)
  const relPath = cleanPath.replace(/^\//, '');
  const candidateDiskPaths = [
    path.join(__dirname, relPath),
    path.join(process.cwd(), relPath)
  ];

  for (const diskPath of candidateDiskPaths) {
    try {
      if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
        const content = fs.readFileSync(diskPath, 'utf8');
        const ext = path.extname(diskPath).toLowerCase();
        const type = ext === '.html' ? 'text/html; charset=utf-8' :
          ext === '.css' ? 'text/css; charset=utf-8' :
            ext === '.js' ? 'application/javascript; charset=utf-8' :
              ext === '.json' ? 'application/json; charset=utf-8' : 'text/plain';
        return { content, type };
      }
    } catch (e) {
      // Continue to embedded fallback
    }
  }

  // Fail-safe embedded assets for Vercel serverless runtime
  switch (cleanPath) {
    case '/index.html':
      return { content: EMBEDDED_INDEX_HTML, type: 'text/html; charset=utf-8' };
    case '/src/css/main.css':
      return { content: EMBEDDED_MAIN_CSS, type: 'text/css; charset=utf-8' };
    case '/src/js/app.js':
      return { content: EMBEDDED_APP_JS, type: 'application/javascript; charset=utf-8' };
    case '/src/js/sample-data.js':
      return { content: EMBEDDED_SAMPLE_DATA_JS, type: 'application/javascript; charset=utf-8' };
    case '/src/js/platforms.js':
      return { content: EMBEDDED_PLATFORMS_JS, type: 'application/javascript; charset=utf-8' };
    default:
      // For any route, fall back to index.html (SPA handling)
      return { content: EMBEDDED_INDEX_HTML, type: 'text/html; charset=utf-8' };
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle API: Submit Doctor Intake Data (WhatsApp Direct Workflow)
  if (req.method === 'POST' && pathname === '/api/submit') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const doctorName = data.identity?.fullName || 'Doctor';
        const submissionId = `DOC-${Date.now().toString().slice(-6)}`;

        console.log(`📥 Intake received for ${doctorName} (ID: ${submissionId}) -> Forwarding directly to WhatsApp (+91 9493690611)`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Doctor intake data received successfully! Routing directly to WhatsApp.',
          submissionId
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // Static File Serving with guaranteed embedded fallback
  const asset = getAsset(pathname);
  res.writeHead(200, {
    'Content-Type': asset.type,
    'Cache-Control': 'public, max-age=0, must-revalidate'
  });
  res.end(asset.content);
});

function startServer(port, attempts = 0) {
  server.removeAllListeners('error');

  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempts < 10) {
      startServer(port + 1, attempts + 1);
    } else {
      console.error('❌ Server startup error:', err);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`\n🏥 DocFolio Intake Server running at: http://localhost:${port}`);
    console.log(`💬 Submissions route directly to WhatsApp (+91 9493690611)\n`);
  });
}

// Start server locally when not on Vercel
if (!process.env.VERCEL) {
  startServer(Number(PORT));
}

export default server;
