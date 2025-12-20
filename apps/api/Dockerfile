FROM node:20-alpine

WORKDIR /app

# Copy package files from api workspace
COPY apps/api/package*.json ./

# Install dependencies
RUN npm install

# Copy api source code
COPY apps/api/ ./

# Expose port
EXPOSE 5000

# Start development server
CMD ["npm", "run", "dev"]
