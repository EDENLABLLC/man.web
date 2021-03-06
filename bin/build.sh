#!/bin/bash

# This script builds an image based on a Dockerfile and package.json that is located in root of git working tree.

# Find package.json inside project tree.
# This allows to call bash scripts within any folder inside project.
DOCKER_HUB_ACCOUNT='edenlabllc'

PROJECT_DIR=$(git rev-parse --show-toplevel)
if [ ! -f "${PROJECT_DIR}/package.json" ]; then
    echo "[E] Can't find '${PROJECT_DIR}/package.json'."
    echo "    Check that you run this script inside git repo or init a new one in project root."
fi

# Extract project name package.json
PROJECT_NAME=$(cat "${PROJECT_DIR}/package.json" \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# Get project version by standart-version
PROJECT_VERSION=$(standard-version -m "fix: [ci skip] publish %s" --dry-run \
  | grep 'release v' \
  | awk -Frelease '{ print $2 }' \
  | xargs)

echo "[I] Building a Docker container '${PROJECT_NAME}' (version '${PROJECT_VERSION}') from path '${PROJECT_DIR}'.."

sudo docker build --tag "${DOCKER_HUB_ACCOUNT}/${PROJECT_NAME}:${PROJECT_VERSION}" \
             --file "${PROJECT_DIR}/Dockerfile" \
             "$PROJECT_DIR"