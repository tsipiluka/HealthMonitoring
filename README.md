# HealthMonitoring Anwendung

## Introduction
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)

## Requirements
Eine aktuelle Installation von [Docker](https://www.docker.com/) ist erforderlich.
Eine Überprüfung kann mit dem Befehl `docker --version` durchgeführt werden.
Falls Docker nicht installiert ist, kann es unter den [hier](https://docs.docker.com/get-docker/) angegebenen Anweisungen installiert werden.

## Was der Compose Stack macht:
1. Erstellt alle Backend Funktionalitäten welche folgende Services beinhalten:
   - [x] [Django Python](https://www.djangoproject.com/) Backend
   - [x] [PostgreSQL](https://www.postgresql.org/) Datenbank
2. Erstellt alle Frontend Funktionalitäten welche folgende Services beinhalten:
   - [x] [Node](https://nodejs.org/en/) Frontend
   - [x] [Angular](https://reactjs.org/) Framework
   - [x] [Nginx](https://www.nginx.com/) Web Server

## Installation
1. Klonen Sie das Repository mit dem Befehl `git clone` 
2. Wechseln Sie in das Verzeichnis `cd HealthMonitoring`
3. Wechseln Sie den Branch mit dem Befehl `git checkout develop`
4. Starten Sie den Docker Compose Stack mit dem Befehl `docker-compose up --build`

## Verwendung
Die Komponenten des Docker Compose Stacks sind über die folgenden URLs erreichbar:
| Page | URL |
| --- | --- |
| Backend | http://localhost:8000 |
| Frontend | http://localhost:4200 |

## Wie werden Secrets verwendet?
Im Branch befindet sich eine Datei mit dem Namen `vars-dev.env.example`. Diese muss in `vars-dev.env` umbenannt werden. In dieser Datei können die Secrets hinterlegt werden. Diese werden dann im Docker Compose Stack verwendet.

## Warum kann der main Branch nicht zum lokalen Entwickeln oder Testen verwendet werden?
Der `main` Branch ist nur zum Deployment auf dem Server gedacht. Auf dem Server wird zusätzlich zu den Backend und Frontend Komponenten noch ein Reverse Proxy eingesetzt. Dieser ist im main Branch bereits integriert. Dieser Reverse Proxy ist für die Kommunikation zwischen dem Backend und dem Frontend zuständig. Dieser ist im `develop` Branch noch nicht integriert. Daher kann der `main` Branch nicht zum lokalen Entwickeln oder Testen verwendet werden.
