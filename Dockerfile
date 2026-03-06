# =============================================
# PIZZA REACT - Dockerfile (Multi-stage)
# =============================================

# --- Stage 1: Build the React frontend ---
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy frontend source and build
COPY index.html vite.config.js ./
COPY src/ ./src/
COPY public/ ./public/

RUN npm run build

# --- Stage 2: Backend + serve frontend ---
FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

# Copy backend source
COPY backend/ ./

# Copy built frontend into backend's public folder
COPY --from=frontend-build /app/dist ./public

# Expose backend port
EXPOSE 3001

# Start the application
CMD ["node", "server.js"]
