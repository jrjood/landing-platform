import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import projectsRouter from './routes/projects';
import leadsRouter from './routes/leads';
import adminAuthRouter from './routes/admin/auth';
import adminProjectsRouter from './routes/admin/projects';
import adminLeadsRouter from './routes/admin/leads';
import adminAmenitiesRouter from './routes/admin/amenities';
import adminDevelopersRouter from './routes/admin/developers';
import mediaRouter from './routes/media';
import { pool } from './config/database';
import { RowDataPacket } from 'mysql2';
import { projectService } from './services/projectService';

// Load environment variables
dotenv.config();

// Setup logging
const logFile = path.join(process.cwd(), 'app.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  logStream.write(logMessage);
}

// Log startup
log('=== Application Starting ===');
log(`Node version: ${process.version}`);
log(`Working directory: ${process.cwd()}`);
log(`Environment: ${process.env.NODE_ENV}`);
log(`Port: ${process.env.PORT}`);
log(`Database configuration loaded: ${process.env.DB_NAME ? 'yes' : 'no'}`);

const app = express();
const PORT = process.env.PORT || 5000;

interface SitemapProject extends RowDataPacket {
  slug: string;
  subdomain: string | null;
  updated_at: Date;
}

// Middleware
const defaultCorsOrigins = 'http://localhost:5173,http://127.0.0.1:5173';
const allowedOrigins = (process.env.CORS_ORIGIN || defaultCorsOrigins)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsRootDomain = process.env.CORS_ROOT_DOMAIN;
log(`CORS explicit origins configured: ${allowedOrigins.length}`);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (corsRootDomain) {
        try {
          const hostname = new URL(origin).hostname;
          if (
            hostname === corsRootDomain ||
            hostname.endsWith(`.${corsRootDomain}`)
          ) {
            return callback(null, true);
          }
        } catch {
          return callback(new Error(`Invalid CORS origin: ${origin}`));
        }
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = hits.get(key);

    if (!record || record.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= limit) {
      return res
        .status(429)
        .json({ error: 'Too many requests. Please try again later.' });
    }

    record.count += 1;
    return next();
  };
}

const leadRateLimit = createRateLimiter(20, 15 * 60 * 1000);
const authRateLimit = createRateLimiter(10, 15 * 60 * 1000);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const rootUrl =
      process.env.PUBLIC_SITE_URL ||
      `${req.protocol}://${req.get('host') || 'localhost:5173'}`;
    const baseDomain = new URL(rootUrl).hostname.split('.').slice(-2).join('.');
    const protocol = new URL(rootUrl).protocol;

    const rows = await projectService.getSitemapProjects();

    const urls = rows.map((project: any) => {
      const loc = project.subdomain
        ? `${protocol}//${project.subdomain}.${baseDomain}/`
        : `${rootUrl.replace(/\/$/, '')}/${project.slug}`;

      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${project.updated_at.toISOString()}</lastmod>`,
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.9</priority>',
        '  </url>',
      ].join('\n');
    });

    res.type('application/xml').send(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        '</urlset>',
      ].join('\n')
    );
  } catch (error) {
    log(`SITEMAP ERROR: ${(error as Error).message}`);
    res.status(500).type('text/plain').send('Failed to generate sitemap');
  }
});

// Serve uploaded files
app.use(
  '/uploads',
  express.static(path.resolve(process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads')))
);

// API Routes
app.use('/api/projects', projectsRouter);
app.use('/api/leads', leadRateLimit, leadsRouter);
app.use('/api/admin/auth', authRateLimit, adminAuthRouter);
app.use('/api/admin/projects', adminProjectsRouter);
app.use('/api/admin/leads', adminLeadsRouter);
app.use('/api/admin/amenities', adminAmenitiesRouter);
app.use('/api/admin/developers', adminDevelopersRouter);
app.use('/api/media', mediaRouter);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    log(`ERROR: ${err.message}`);
    log(`Stack: ${err.stack}`);
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  }
);

// Start server
app.listen(PORT, () => {
  log(`✅ API server running on port ${PORT}`);
  log(
    `📡 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`
  );
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(
    `📡 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`
  );
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log(`UNCAUGHT EXCEPTION: ${error.message}`);
  log(`Stack: ${error.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`UNHANDLED REJECTION: ${reason}`);
  process.exit(1);
});
