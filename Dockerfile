# Multistage Dockerfile for Urvixa — Agri AI Suite Production Deployment

# --- Stage 1: Build Frontend App ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Production Python Backend & Static Server ---
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    nginx \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements & install
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt gunicorn uvicorn

# Copy backend source
COPY backend ./backend

# Copy built frontend assets to Nginx html directory
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Expose ports
EXPOSE 80 8000

# Copy startup script
COPY deploy.sh /app/deploy.sh
RUN chmod +x /app/deploy.sh

CMD ["/app/deploy.sh"]
