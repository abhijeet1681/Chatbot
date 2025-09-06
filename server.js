import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files if a build directory exists (optional)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Simple fallback route without wildcards
app.get('/', (req, res) => {
  res.send('Node server is running. Add your frontend build in the "dist" folder or update routes as needed.');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

