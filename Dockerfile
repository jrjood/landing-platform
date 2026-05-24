# ---- Build Frontend ----
FROM node:20-alpine AS web-builder
WORKDIR /app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
RUN npm ci --workspace=apps/web

COPY apps/web ./apps/web
RUN npm run build --workspace=apps/web

# ---- Build API ----
FROM node:20-alpine AS api-builder
WORKDIR /app

RUN apk add --no-cache python3 make g++
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci --workspace=apps/api

COPY apps/api ./apps/api
RUN npm run build --workspace=apps/api

# ---- Production ----
FROM node:20-alpine AS production
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache tini

# Copy built frontend
COPY --from=web-builder /app/apps/web/dist ./apps/web/dist
COPY --from=web-builder /app/apps/web/public/.htaccess ./apps/web/dist/.htaccess
COPY --from=web-builder /app/apps/web/public/robots.txt ./apps/web/dist/robots.txt

# Copy built API
COPY --from=api-builder /app/apps/api/dist ./apps/api/dist
COPY --from=api-builder /app/apps/api/node_modules ./apps/api/node_modules

# Copy package.json for workspace detection
COPY package*.json ./

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 5000

ENV NODE_ENV=production

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "apps/api/dist/index.js"]
