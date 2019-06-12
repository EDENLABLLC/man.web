#!/bin/bash

set -ex

PROJECT_DIR=$(git rev-parse --show-toplevel)
PROJECT_VERSION=$(cat "${PROJECT_DIR}/package.json" \
 | grep version \
 | head -1 \
 | awk -F: '{ print $2 }' \
 | sed 's/[",]//g' \
 | tr -d '[[:space:]]')

if [ -z "$CHANGE_ID" ]; then
    if [ "$BRANCH_NAME" == "master" ]; then
    echo "Logging in into Docker Hub";
    echo ${DOCKER_PASSWORD} | sudo docker login -u ${DOCKER_USERNAME} --password-stdin

    if [ ! $DOCKER_USERNAME ]; then
        echo "[E] You need to specify Docker Hub account"
        exit 1
    fi

    APPS_LIST=$(echo ${APPS} | jq -r '.[].app');
    for app in ${APPS_LIST}
    do
        echo "[I] Pushing changes to Docker Hub.."
 #       echo "docker tag \"${DOCKER_NAMESPACE}/${app}:$GIT_COMMIT\" \"${DOCKER_NAMESPACE}/${app}:develop\""
        echo "docker push \"${DOCKER_NAMESPACE}/${app}:v${PROJECT_VERSION}\""
 #       echo "docker rmi \"${DOCKER_NAMESPACE}/${app}:develop\""
 #       sudo docker tag "${DOCKER_NAMESPACE}/${app}:$GIT_COMMIT" "${DOCKER_NAMESPACE}/${app}:develop"
        sudo docker push "${DOCKER_NAMESPACE}/${app}:v${PROJECT_VERSION}"
    done
    else
      echo "not a master branch"
    fi;
    else
    echo "This is PR"
fi;

