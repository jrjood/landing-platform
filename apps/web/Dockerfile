FROM node:20-alpine

WORKDIR /app

# Copy package files from web workspace
COPY apps/web/package*.json ./

# Install dependencies
RUN npm install

# Copy web source code
COPY apps/web/ ./

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
