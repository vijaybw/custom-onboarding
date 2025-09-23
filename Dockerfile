# -------------------
# Build Frontend
# -------------------
FROM node:20 AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install --production=false
COPY frontend/ .
RUN npm run build

# -------------------
# Backend with Python + Nginx
# -------------------
FROM python:3.11-slim

# Install system deps (for psycopg2, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    nginx \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Copy built frontend into Flask static folder
COPY --from=frontend-build /frontend/dist /app/static

# Configure Nginx to serve frontend
COPY nginx.conf /etc/nginx/nginx.conf

# Expose Flask port
EXPOSE 5000

# Start both Nginx (for frontend) and Gunicorn (for backend)
CMD service nginx start && gunicorn -b 0.0.0.0:5000 app:app