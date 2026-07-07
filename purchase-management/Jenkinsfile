// Jenkinsfile – CI/CD for purchase-management (Vite SPA)
pipeline {
    agent any

    tools {
        nodejs 'node-20'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install') {
            steps { bat 'npm ci' }
        }

        stage('Lint & Type-check') {
            steps {
                bat 'npm run lint:check'
                bat 'npm run type-check'
            }
        }

        stage('Test') {
            steps { bat 'npm run test:run' }
        }

        stage('Build') {
            steps { bat 'npm run build' }
        }

        stage('Docker Build & Push') {
            when { branch 'main' }
            steps {
                bat 'docker build -t purchase-management:${BUILD_NUMBER} .'
                // bat 'docker push your-registry/purchase-management:${BUILD_NUMBER}'
            }
        }
    }
}
