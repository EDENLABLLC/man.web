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
    RELEASE_BRANCH="master"
    DOCKER_HUB_ACCOUNT="edenlabllc"
    MAIN_BRANCHES="master develop"  
    PROJECT_NAME = 'man-web'
    DOCKER_NAMESPACE = 'edenlabllc'
    REPOSITORY_NAME = 'man.web'
  }
  stages {
    stage('Check commit and PR requirements') {
      options {
        timeout(activity: true, time: 3)
      }
      steps {
        sh '''
          sudo rm /var/lib/dpkg/lock-frontend    
          sudo rm /var/cache/apt/archives/lock
          sudo rm /var/lib/dpkg/lock      
          sudo dpkg --configure -a    
          sudo apt-get update;      
          sudo apt-get install -y ruby-dev;
          sudo gem install json;
          env;
          curl -s https://raw.githubusercontent.com/edenlabllc/ci-utils/umbrella_jenkins_gce_new/check-PR.sh -o check-PR.sh;
          chmod +x ./check-PR.sh;
          ./check-PR.sh
          '''
      }
    }    
    stage('Init') {
      options {
        timeout(activity: true, time: 3)
      }
      steps {
        sh 'cat /etc/hostname'
        sh 'sudo docker rm -f $(sudo docker ps -a -q) || true'
        sh 'sudo docker rmi $(sudo docker images -q) || true'
        sh 'sudo docker system prune -f'
        sh '''
          sudo docker run -d --name selenium -p 4444:4444 selenium/standalone-chrome:3;
          sudo docker ps;
        '''
        sh '''
          sudo sudo apt-get -y update
          sudo curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
          sudo rm /var/lib/dpkg/lock-frontend    
          sudo rm /var/cache/apt/archives/lock
          sudo rm /var/lib/dpkg/lock      
          sudo dpkg --configure -a          
          sudo apt-get install -y nodejs
          nodejs -v       
          npm -v
          npm install karma --save-dev
          npm install karma-jasmine karma-chrome-launcher jasmine-core --save-dev       
        '''       
      }
    }
    stage('Test') {
      options {
        timeout(activity: true, time: 3)
      }
      steps {
        sh '''
           npm run test
           npm run lint || exit 1;
          '''
      }
    }
    stage('Build') {
      parallel {
        stage('Build man-web-app') {
          options {
            timeout(activity: true, time: 3)
          }
          steps {
            sh '''
              sudo ./bin/version-increment.sh
              sudo ./bin/build.sh
            '''
          }
        }
      }
    }
    stage('Run man-web-app and push') {
      options {
        timeout(activity: true, time: 3)
      }
      steps {
        sh '''
          sudo ./bin/start.sh
          sleep 5
          sudo docker ps
          echo $travis
          npm run nightwatch -- -e travis
        '''
        withCredentials(bindings: [usernamePassword(credentialsId: '8232c368-d5f5-4062-b1e0-20ec13b0d47b', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
          sh 'echo " ---- step: Push docker image ---- ";'
          sh '''
              sudo ./bin/ci/push.sh
            '''
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
            sh '''
              curl -s https://raw.githubusercontent.com/edenlabllc/ci-utils/umbrella_jenkins_gce/autodeploy.sh -o autodeploy.sh;
              chmod +x ./autodeploy.sh;
              ./autodeploy.sh
            '''
          }
        }
      }
    }
} 
/*
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
  }   */
}
