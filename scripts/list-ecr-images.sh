#!/usr/bin/env bash

AWS_ACCOUNT_ID=480203687881

aws ecr get-login-password \
  --region eu-central-1 \
| docker login \
  --username AWS \
  --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.eu-central-1.amazonaws.com

aws ecr list-images \
  --repository-name ewandr/be-core-service \
  --region eu-central-1 \
  --query 'imageIds[].imageTag' \
  --output text
