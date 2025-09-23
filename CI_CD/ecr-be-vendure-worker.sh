#!/usr/bin/env bash
set -e

export SERVICE_NAME=be-vendure
export WORKER_NAME=be-vendure-worker
export REPO_NAME=ewandr/$WORKER_NAME
export DOCKER_FILE=prod.worker.Dockerfile
export SERVICE_PATH=apps/backends/$SERVICE_NAME

# Проверяем IMAGE_TAG
if [ -z "$IMAGE_TAG" ]; then
  echo "❌ ERROR: IMAGE_TAG is not set!"
  exit 1
fi

echo "🏗️ Building $WORKER_NAME with tag: $IMAGE_TAG"

# 1) Login to ECR
source CI_CD/ecr-login.sh

# 2) Build сразу с ECR именем - избегаем двойного тегирования
ECR_IMAGE="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:$IMAGE_TAG"
echo "📦 Building Docker image: $ECR_IMAGE"

echo "Docker build context: $(pwd)"
docker build --platform linux/amd64 -f $SERVICE_PATH/$DOCKER_FILE \
  -t $ECR_IMAGE .

# 3) Push - теперь не нужен дополнительный tag
echo "📤 Pushing to ECR..."
docker push $ECR_IMAGE

echo "✅ Successfully pushed $SERVICE_NAME:$IMAGE_TAG"
