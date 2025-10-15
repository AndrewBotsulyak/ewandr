#!/bin/bash

set -e

echo "🔐 Logging in to AWS ECR..."
source CI_CD/ecr-login.sh

echo "📦 Pulling latest images from ECR..."
docker-compose --env-file env/.env.docker-compose.context.prod.yml -f docker-compose.prod.local.yml pull

echo "🚀 Starting production environment locally..."
docker-compose --env-file env/.env.docker-compose.context.prod.yml -f docker-compose.prod.local.yml up -d

echo "✅ Production environment is running!"
echo ""
echo "📊 Container status:"
docker-compose --env-file env/.env.docker-compose.context.prod.yml -f docker-compose.prod.local.yml ps

echo ""
echo "💡 Useful commands:"
echo "  View logs: docker-compose --env-file env/.env.docker-compose.context.prod.yml -f docker-compose.prod.local.yml logs -f"
echo "  Stop all: docker-compose --env-file env/.env.docker-compose.context.prod.yml -f docker-compose.prod.local.yml down"
