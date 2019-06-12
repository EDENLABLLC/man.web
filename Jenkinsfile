def author() {
  return sh(returnStdout: true, script: 'git log -n 1 --format="%an"').trim()
}
pipeline {
  agent {
    node { 
      label 'ehealth-build' 
      }
  }
  environment {
    RELEASE_BRANCH="jenkins"
    GIT_BRANCH="jenkins"
    DOCKER_HUB_ACCOUNT="edenlabllc"
    MAIN_BRANCHES="master develop"  
    PROJECT_NAME = "man-web"
    DOCKER_NAMESPACE = 'edenlabllc'
  }
  stages {
    stage('Init') {
      options {
        timeout(activity: true, time: 3)
      }
      steps {
        sh 'cat /etc/hostname'
        sh 'sudo docker rm -f $(sudo docker ps -a -q) || true'
        sh 'sudo docker rmi $(sudo docker images -q) || true'
        sh 'sudo docker system prune -f'
        sh 'chmod -R +x bin'
        sh 'chmod -R 777 /home/jenkins'
        sh '''
          sudo curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
          sudo rm /var/lib/dpkg/lock-frontend
          sudo rm /var/cache/apt/archives/lock
          sudo rm /var/lib/dpkg/lock
          sudo dpkg --configure -a
          sudo apt-get install -y nodejs
          nodejs -v
          npm -v
          npm install
          sudo npm i -g standard-version
          sudo npm install karma --save-dev
          sudo npm install karma-jasmine karma-chrome-launcher jasmine-core --save-dev
        '''
      }
    }
    stage('Test and build') {
      parallel {
        stage('Test') {
          options {
           timeout(activity: true, time: 3)
          }
          steps {
 //           sh 'npm run test'
            sh 'echo test'

          }
        }
        stage('Build man-web-app') {
          options {
            timeout(activity: true, time: 3)
          }
          
          steps {
          //  sh 'sudo ./bin/version-increment.sh'
            sh 'sudo ./bin/build.sh'
          }
        }
      }
    }
    stage('Run man-web-app and push') {
      options {
        timeout(activity: true, time: 3)
      }
      environment {
        APPS='[{"app":"man.web","label":"fe","namespace":"man","chart":"man", "deployment":"fe"}]'
      }
      steps {
        sh '''
          sudo ./bin/start.sh
          sleep 5
          sudo docker ps
         '''
        withCredentials(bindings: [usernamePassword(credentialsId: '8232c368-d5f5-4062-b1e0-20ec13b0d47b', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
          sh 'echo " ---- step: Push to hit hub ---- ";'
          withCredentials([string(credentialsId: '86a8df0b-edef-418f-844a-cd1fa2cf813d', variable: 'GITHUB_TOKEN')]) {
            withCredentials([file(credentialsId: '091bd05c-0219-4164-8a17-777f4caf7481', variable: 'GCLOUD_KEY')]) {
              sh './bin/version-increment.sh'
            }
          }
          sh 'echo " ---- step: Push docker image ---- ";'
          // sh 'curl -s https://raw.githubusercontent.com/edenlabllc/ci-utils/umbrella_jenkins_gce/push-changes.sh -o push-changes.sh'
          // sh 'sudo chmod +x ./push-changes.sh'
          // sh './push-changes.sh'
          sh './bin/push-changes.sh'
        }
        
      }
    }
    stage('Deploy') {
      options {
        timeout(activity: true, time: 3)
      }
      environment {
        APPS='[{"app":"man_web","label":"fe","namespace":"man","chart":"man", "deployment":"fe"}]'
      }
      steps {
        withCredentials([string(credentialsId: '86a8df0b-edef-418f-844a-cd1fa2cf813d', variable: 'GITHUB_TOKEN')]) {
          withCredentials([file(credentialsId: '091bd05c-0219-4164-8a17-777f4caf7481', variable: 'GCLOUD_KEY')]) {
            sh 'sudo chmod +x ./bin/deploy.sh'
            sh './bin/deploy.sh'
          }
        }
      }
    }
} 

  post {
    success {
      script {
        if (env.CHANGE_ID == null) {
          slackSend (color: 'good', message: "Build <${env.RUN_DISPLAY_URL}|#${env.BUILD_NUMBER}> (<https://github.com/edenlabllc/man.web/commit/${env.GIT_COMMIT}|${env.GIT_COMMIT.take(7)}>) of ${env.JOB_NAME} by ${author()} *success* in ${currentBuild.durationString.replace(' and counting', '')}")
        } else if (env.BRANCH_NAME.startsWith('PR')) {
          slackSend (color: 'good', message: "Build <${env.RUN_DISPLAY_URL}|#${env.BUILD_NUMBER}> (<https://github.com/edenlabllc/man.web/pull/${env.CHANGE_ID}|${env.GIT_COMMIT.take(7)}>) of ${env.JOB_NAME} in PR #${env.CHANGE_ID} by ${author()} *success* in ${currentBuild.durationString.replace(' and counting', '')}")
        }
      }
    }
    failure {
      script {
        if (env.CHANGE_ID == null) {
          slackSend (color: 'danger', message: "Build <${env.RUN_DISPLAY_URL}|#${env.BUILD_NUMBER}> (<https://github.com/edenlabllc/man.web/commit/${env.GIT_COMMIT}|${env.GIT_COMMIT.take(7)}>) of ${env.JOB_NAME} by ${author()} *failed* in ${currentBuild.durationString.replace(' and counting', '')}")
        } else if (env.BRANCH_NAME.startsWith('PR')) {
          slackSend (color: 'danger', message: "Build <${env.RUN_DISPLAY_URL}|#${env.BUILD_NUMBER}> (<https://github.com/edenlabllc/man.web/pull/${env.CHANGE_ID}|${env.GIT_COMMIT.take(7)}>) of ${env.JOB_NAME} in PR #${env.CHANGE_ID} by ${author()} *failed* in ${currentBuild.durationString.replace(' and counting', '')}")
        }
      }
    }
    aborted {
      script {
        if (env.CHANGE_ID == null) {
          slackSend (color: 'warning', message: "Build <${env.RUN_DISPLAY_URL}|#${env.BUILD_NUMBER}> (<https://github.com/edenlabllc/man.web/commit/${env.GIT_COMMIT}|${env.GIT_COMMIT.take(7)}>) of ${env.JOB_NAME} by ${author()} *canceled* in ${currentBuild.durationString.replace(' and counting', '')}")
        } else if (env.BRANCH_NAME.startsWith('PR')) {
          slackSend (color: 'warning', message: "Build <${env.RUN_DISPLAY_URL}|#${env.BUILD_NUMBER}> (<https://github.com/edenlabllc/man.web/pull/${env.CHANGE_ID}|${env.GIT_COMMIT.take(7)}>) of ${env.JOB_NAME} in PR #${env.CHANGE_ID} by ${author()} *canceled* in ${currentBuild.durationString.replace(' and counting', '')}")
        }
      }
    }
  } 
}
