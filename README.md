# HealthMonitoring
---
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)

## Introduction
This application is designed to help users to easily manage and track their medical findings. With the app, users can upload and store their medical findings, and share them with their doctors and other users. The app offers a secure and reliable way to store and view medical documents with attachments. It provides an overview of each user's medical history, allowing them to easily track their progress and health over time.

### IMPORTANT :warning:
This branch of the application is for development purposes only. It is not intended to be used in production. For production purposes, please use the `master` branch.

## Requirements

### Docker
Make sure to have [Docker](https://www.docker.com/) installed.
Check by running `docker --version` in your terminal. If the command is not found, install Docker by following the instructions [here](https://docs.docker.com/get-docker/).

### npm
Make sure to have [npm](https://www.npmjs.com/) installed.
Check by running `npm --version` in your terminal. If the command is not found, install npm by following the instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## What this Compose does
1. Providing all backend functionalities uncluding:
   - [x] [Django Python](https://www.djangoproject.com/) backend
   - [x] [PostgreSQL](https://www.postgresql.org/) database

2. Providing all frontend functionalities uncluding:
   - [x] [Node](https://nodejs.org/en/) frontend
   - [x] [Angular](https://reactjs.org/) framework
   - [x] [Nginx](https://www.nginx.com/) web server

## How to use variables and secrets for the development environment
1. Create a `vars-dev.env` file in the root directory of the project or copy the `vars-dev.env.example` file and rename it to `vars-dev.env`.
2. Fill in the variables in the `vars-dev.env` file with the appropriate values.
3. This file is used by the `docker-compose.yml` file to set the environment variables for the containers.

## How to use this Compose file
1. Clone the repository
   ```bash
   git clone
    ```
2. Switch to branch `development`
   ```bash
   git checkout development
   ```
3. Run the following command to start the application
   ```bash
    docker-compose up --build
    ```
    If the application is running successfully, you should see the following output:
    ```bash
    Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
    Creating healthmonitoring_frontend_1 ... done
    Creating healthmonitoring_db_1       ... done
    Creating healthmonitoring_backend_1  ... done
    Attaching to healthmonitoring_db_1, healthmonitoring_frontend_1, healthmonitoring_backend_1
    ```
4. Open your browser and go to `http://localhost:4200/` to view the application frontend.
5. Open your browser and go to `http://localhost:8000/` to view the application backend.
