# Production Deployment Checklist

## Environment Variables

### Backend (`apps/api/.env`)
```env
# Security
JWT_SECRET=<generate-a-strong-random-secret>
CORS_ORIGIN=https://wealthholding-eg.com,https://www.wealthholding-eg.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=landing_user
DB_PASSWORD=<strong-password>
DB_NAME=landing_platform

# Server
PORT=3001
NODE_ENV=production
UPLOADS_DIR=/var/www/landing-platform/uploads
```

### Frontend (`apps/web/.env`)
```env
VITE_API_URL=https://api.wealthholding-eg.com
```

## Before Going Live

### Security
- [ ] Generate strong JWT secret: `openssl rand -hex 32`
- [ ] Set strong DB password
- [ ] Enable HTTPS (certbot/Let's Encrypt)
- [ ] Uncomment HSTS header in `.htaccess`
- [ ] Set CORS_ORIGIN to production domain only (not `*`)
- [ ] Disable directory listing on web server
- [ ] Keep API rate limiting enabled for auth and lead submission routes

### Database
- [ ] Run `db/schema.sql` on production DB
- [ ] For existing databases, run `db/media_asset_metadata_migration.sql` after the main migration
- [ ] Run `db/seed.sql` for initial admin user
- [ ] Create read-only DB user for monitoring if needed

### Files & Media
- [ ] Create the `UPLOADS_DIR` directory with write permissions for the API process
- [ ] Confirm generated WebP, thumbnail, and medium image variants are created after upload
- [ ] Confirm media delete removes original and generated variants
- [ ] Set up S3 storage adapter if scaling (see below)
- [ ] Periodically backup uploads folder or configure object storage lifecycle backups

### DNS & Web Server
- [ ] Point A record to server IP
- [ ] Add CNAME records for subdomains: `*.wealthholding-eg.com`
- [ ] Configure Apache/nginx with the `.htaccess` from `apps/web/public/.htaccess`
- [ ] Enable `mod_rewrite`, `mod_deflate`, `mod_expires`, `mod_headers`

### Monitoring
- [ ] Set up error logging (Sentry or similar)
- [ ] Set up uptime monitoring
- [ ] Configure DB backups (daily cron)
- [ ] Set up log rotation

## Optional: S3 Storage Adapter

If deploying to production with multiple servers, replace local disk storage:

1. Install `@aws-sdk/client-s3` in `apps/api`
2. Create `mediaService.s3.ts` with `S3Client` + `PutObjectCommand`
3. Create a config flag: `STORAGE_DRIVER=local|s3`
4. Fall back to local during development

## Docker Production Build

Optimize images with multi-stage builds in `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/web/dist ./apps/web/dist
CMD ["node", "apps/api/dist/index.js"]
```
