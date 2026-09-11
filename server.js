import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

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

        console.log(`📥 Intake received for ${doctorName} (ID: ${submissionId}) -> Forwarding directly to WhatsApp`);

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
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

  // Static File Serving with multi-path resolution
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  let filePath = path.join(__dirname, relativePath);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), relativePath);
  }
  filePath = path.normalize(filePath);

  // Security check: ensure path is within __dirname or process.cwd()
  const isSafe = filePath.startsWith(__dirname) || filePath.startsWith(process.cwd());
  if (!isSafe) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If file not found, fallback to index.html for SPA-style handling
      if (pathname.includes('.') && !pathname.endsWith('.html')) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      filePath = fs.existsSync(path.join(__dirname, 'index.html'))
        ? path.join(__dirname, 'index.html')
        : path.join(process.cwd(), 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<!DOCTYPE html><html><body><h2>DocFolio Portal: Page not found</h2><p><a href="/">Return to Home</a></p></body></html>');
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, must-revalidate'
      });
      res.end(content);
    });
  });
});

function startServer(port, attempts = 0) {
  server.removeAllListeners('error');

  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempts < 10) {
      console.log(`⚠️  Port ${port} is already in use. Trying port ${port + 1}...`);
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
