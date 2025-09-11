#!/usr/bin/env bash

scp -i ~/.ssh/LightsailDefaultKey-eu-central-1.pem \
      ~/Development/ewandr-workspace/docker-compose.prod.yml \
      ubuntu@3.120.55.30:~/ewandr/docker-compose.prod.yml


