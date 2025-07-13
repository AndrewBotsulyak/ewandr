#!/usr/bin/env bash
set -e

export SERVICE_NAME=be-core-service
export REPO_NAME=ewandr/$SERVICE_NAME
#export IMAGE_TAG=$(git rev-parse --short HEAD)
export IMAGE_TAG=latest
export DOCKER_FILE=prod.Dockerfile
export SERVICE_PATH=apps/backends/$SERVICE_NAME

# 1) Login to ECR
source CI_CD/ecr-login.sh

# 2) Build
docker build --platform linux/amd64,linux/arm64 -f $SERVICE_PATH/$DOCKER_FILE \
  -t $REPO_NAME:$IMAGE_TAG ./

# 3) Add ECR-tag
docker tag $REPO_NAME:$IMAGE_TAG \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:$IMAGE_TAG

# 4) Push
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:$IMAGE_TAG
