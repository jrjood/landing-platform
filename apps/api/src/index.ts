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
log(`DB Host: ${process.env.DB_HOST}`);
log(`DB Name: ${process.env.DB_NAME}`);
log(`CORS Origin: ${process.env.CORS_ORIGIN}`);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/projects', projectsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/projects', adminProjectsRouter);
app.use('/api/admin/leads', adminLeadsRouter);

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
