#!/bin/bash

# This script starts a local Docker container with created image.

# Find package.json inside project tree.
# This allows to call bash scripts within any folder inside project.
DOCKER_HUB_ACCOUNT='edenlabllc'

PROJECT_DIR=$(git rev-parse --show-toplevel)
if [ ! -f "${PROJECT_DIR}/package.json" ]; then
    echo "[E] Can't find '${PROJECT_DIR}/package.json'."
    echo "    Check that you run this script inside git repo or init a new one in project root."
fi

# Extract project name from package.json
PROJECT_NAME=$(cat "${PROJECT_DIR}/package.json" \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
# Get project version by standart-version
PROJECT_VERSION=$(standard-version -m "chore(release): publish %s" --dry-run \
  | grep 'release v' \
  | awk -Frelease '{ print $2 }' \
  | xargs)
# PROJECT_VERSION='develop'
HOST_IP=`ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p' | head -n 1`
HOST_NAME="travis"

echo "[I] Starting a Docker container '${PROJECT_NAME}' (version '${PROJECT_VERSION}') from path '${PROJECT_DIR}'.."
echo "[I] Assigning parent host '${HOST_NAME}' with IP '${HOST_IP}'."

echo "${HOST_NAME}:${HOST_IP}"
echo "${DOCKER_HUB_ACCOUNT}/${PROJECT_NAME}:${PROJECT_VERSION}"
docker images | grep ${PROJECT_VERSION}
IMAGES=`docker images | grep ${PROJECT_VERSION}  | wc -l |xargs `


#echo "start ${DOCKER_HUB_ACCOUNT}/${PROJECT_NAME}:${PROJECT_VERSION}"
#sudo docker run -d -p 8080:8080 --name ${PROJECT_NAME} \
#      "${DOCKER_HUB_ACCOUNT}/${PROJECT_NAME}:${PROJECT_VERSION}"
#sleep 5;
#RUNNING_CONTAINERS=`docker ps | grep ${PROJECT_NAME}  | wc -l |xargs `
#if [[ "$RUNNING_CONTAINERS" == "1" ]] 
#then echo "(^_^)~ Container started" 
#  sudo docker logs ${PROJECT_NAME} --tail 10
#else echo "[E] Container is not started\!"
#  sudo docker logs ${PROJECT_NAME} --tail 10 
#  exit 1 
#fi