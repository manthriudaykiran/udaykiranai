/**
 * AI FREEDOM WITH UDAY - Full-Stack Express Server with Vite Middleware
 * Provides local development parity with Vercel Serverless Functions.
 * Delegates /api/register and /api/track directly to the native serverless handlers.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load local environment variables (.env)
dotenv.config();

import registerHandler from './api/register.ts';
import trackHandler from './api/track.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Determine listening port (must be 3000 for AI Studio dev server / Nginx upstream proxy)
function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    return parseInt(process.argv[portArgIndex + 1], 10);
  }
  if (process.env.APP_PORT) {
    return parseInt(process.env.APP_PORT, 10);
  }
  if (process.env.PORT && process.env.PORT !== '8080') {
    return parseInt(process.env.PORT, 10);
  }
  return 3000;
}

const port = getPort();

app.use(express.json());

// ============================================================================
// SERVERLESS FUNCTION PARITY ROUTES
// ============================================================================

// POST /api/register (Delegates to native Vercel handler)
app.all('/api/register', async (req: Request, res: Response) => {
  await registerHandler(req, res);
});

// POST /api/track (Delegates to native Vercel handler)
app.all('/api/track', async (req: Request, res: Response) => {
  await trackHandler(req, res);
});

// GET /api/health (System diagnostic check)
app.get('/api/health', (_req: Request, res: Response) => {
  const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const hasRateLimitSalt = Boolean(process.env.RATE_LIMIT_SALT && process.env.RATE_LIMIT_SALT.length >= 16);

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    serverlessParity: true,
    supabaseConfigured: hasSupabaseUrl && hasServiceKey,
    rateLimitSaltConfigured: hasRateLimitSalt,
  });
});

// ============================================================================
// VITE DEV SERVER & PRODUCTION STATIC ASSETS
// ============================================================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AI Freedom server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
