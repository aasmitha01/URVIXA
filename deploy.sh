#!/bin/sh
set -e

echo "=== Starting Urvixa Production Deployment ==="

# Apply Django Database Migrations
cd /app/backend
python manage.py migrate --noinput
python manage.py collectstatic --noinput || true

# Start Gunicorn WSGI Server for Django API in Background
gunicorn agrisense.wsgi:application --bind 0.0.0.0:8000 --workers 3 &

# Start Nginx for Frontend App in Foreground
exec nginx -g "daemon off;"
