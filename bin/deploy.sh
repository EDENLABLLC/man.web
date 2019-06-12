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
## install kubectl
			curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
			chmod +x ./kubectl
			sudo mv ./kubectl /usr/local/bin/kubectl
## Install helm
			curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh
			chmod 700 get_helm.sh
			./get_helm.sh

# Credentials to GCE
			sudo gcloud auth activate-service-account --key-file=$GCLOUD_KEY
			sudo gcloud container clusters get-credentials dev --zone europe-west1-d --project ehealth-162117
#get helm charts
			git clone https://$GITHUB_TOKEN@github.com/edenlabllc/ehealth.charts.git
			cd ehealth.charts
#get version and project name
			#PROJECT_NAME=$(sed -n 's/.*app: :\([^, ]*\).*/\1/pg' "$TRAVIS_BUILD_DIR/mix.exs")
			CHART=man
			#PROJECT_VERSION="0.1.261"
			sed -i'' -e "1,10s/tag:.*/tag: \"v$PROJECT_VERSION\"/" "$CHART/values-dev.yaml"
			sudo helm init --upgrade
			sleep 15
			sudo helm upgrade  -f $CHART/values-dev.yaml $CHART $CHART 
			cd $PROJECT_DIR/bin
			sudo ./wait-for-deployment.sh fe $CHART 180
   				if [ "$?" -eq 0 ]; then
     				sudo kubectl get pod -n$CHART | grep fe 
     				cd $PROJECT_DIR/ehealth.charts && git add . && sudo  git commit -m "Bump $CHART web to v$PROJECT_VERSION" && sudo git pull && sudo git push
     				exit 0;
   				else 
   	 				sudo kubectl logs $(sudo kubectl get pod -n$CHART | awk '{ print $1 }' | grep fe) -n$CHART 
   	 				sudo helm rollback $CHART $(($(helm ls | grep $CHART | awk '{ print $2 }') -1)) 
   	 				exit 1;
   				fi;
		else
		echo "Not a master brunch"
 		fi;
	else
	echo "This is PR"
fi;