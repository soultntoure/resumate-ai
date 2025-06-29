#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status.

echo "🚀 Starting Resumate AI Local Development Setup..."

# 1. Check for Prerequisites
echo "Checking for prerequisites: Node.js, Yarn, Docker, Git..."
command -v node >/dev/null 2>&1 || { echo >&2 "Node.js is not installed. Aborting."; exit 1; }
command -v yarn >/dev/null 2>&1 || { echo >&2 "Yarn is not installed. Aborting."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo >&2 "Docker is not installed. Aborting."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo >&2 "Docker Compose is not installed. Aborting."; exit 1; }

# 2. Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
  echo "Copying .env.example to .env"
  cp .env.example .env
  echo "Please edit the .env file with your local configurations, then re-run this script if needed."
else
  echo ".env file already exists. Skipping copy."
}

# 3. Start Local Database and Services with Docker Compose
echo "Spinning up Docker Compose services (PostgreSQL, MinIO)..."
docker-compose up -d

echo "Waiting for database to be ready..."
# Simple wait for Postgres. For production, use a more robust health check.
until docker-compose exec db pg_isready -U user -d resumate_db; do
  printf '.'
  sleep 2
done
echo "\nDatabase is ready!"

# 4. Install Dependencies (Yarn Workspaces)
echo "Installing monorepo dependencies using Yarn..."
yarn install

# 5. Setup Database Schema and Generate Prisma Client
echo "Applying Prisma migrations and generating Prisma client..."
yarn workspace @resumate-ai/db prisma migrate deploy # Use deploy in CI, dev for local development iterative changes
yarn workspace @resumate-ai/db prisma generate

# Optional: Seed initial data if a seed script exists
# if [ -f apps/api/prisma/seed.ts ]; then
#   echo "Seeding initial database data..."
#   yarn workspace @resumate-ai/api prisma db seed
# fi

echo "✅ Local Development Setup Complete!"
echo "You can now run the backend and frontend:"
echo "  - Backend: cd apps/api && yarn start:dev OR yarn workspace @resumate-ai/api start:dev"
echo "  - Frontend: cd apps/web && yarn dev OR yarn workspace @resumate-ai/web dev"
