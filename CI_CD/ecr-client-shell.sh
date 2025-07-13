#!/usr/bin/env bash
set -e

export REPO_NAME=ewandr/client-shell
#export IMAGE_TAG=$(git rev-parse --short HEAD)
export IMAGE_TAG=latest
export DOCKER_FILE=prod.Dockerfile

# 1) Login to ECR
source CI_CD/ecr-login.sh

# 2) Build
docker build --platform linux/amd64 -f apps/clients/client-shell/$DOCKER_FILE \
  -t $REPO_NAME:$IMAGE_TAG ./

## 2) Build
#docker buildx build --platform linux/amd64,linux/arm64 -f apps/clients/client-shell/$DOCKER_FILE \
#  -t $REPO_NAME:$IMAGE_TAG ./

# 3) Add ECR-tag
docker tag $REPO_NAME:$IMAGE_TAG \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:$IMAGE_TAG

# 4) Push
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:$IMAGE_TAG
