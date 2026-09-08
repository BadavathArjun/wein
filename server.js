import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const SUBMISSIONS_DIR = path.join(__dirname, 'submissions');

// Ensure submissions directory exists
if (!fs.existsSync(SUBMISSIONS_DIR)) {
  fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true });
}

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

  // Handle API: Submit Doctor Intake Data
  if (req.method === 'POST' && pathname === '/api/submit') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const doctorName = (data.identity?.fullName || 'doctor')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .slice(0, 30);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `intake_${doctorName}_${timestamp}.json`;
        const filePath = path.join(SUBMISSIONS_DIR, filename);

        const record = {
          submissionId: `DOC-${Date.now().toString().slice(-6)}`,
          submittedAt: new Date().toISOString(),
          ip: req.socket.remoteAddress,
          data
        };

        fs.writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf8');

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          success: true,
          message: 'Doctor intake data received and saved successfully!',
          submissionId: record.submissionId,
          filename
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // Handle API: List Submissions
  if (req.method === 'GET' && pathname === '/api/submissions') {
    try {
      const files = fs.readdirSync(SUBMISSIONS_DIR)
        .filter(f => f.endsWith('.json'))
        .map(file => {
          try {
            const raw = fs.readFileSync(path.join(SUBMISSIONS_DIR, file), 'utf8');
            return JSON.parse(raw);
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ success: true, count: files.length, submissions: files }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  filePath = path.normalize(filePath);

  // Security check: ensure path is within __dirname
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If file not found, fallback to index.html for SPA-style handling or 404
      if (pathname.includes('.')) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error loading file');
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
    console.log(`📁 Saved submissions will appear in: ${SUBMISSIONS_DIR}\n`);
  });
}

startServer(Number(PORT));

